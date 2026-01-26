import type { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

// Allowed directories for file modifications (relative to project root)
const ALLOWED_PATHS = [
  "client/src/pages",
  "client/src/components", 
  "client/src/lib",
  "client/src/data",
  "server",
  "shared",
  "scripts",
  "public",
];

// File extensions that can be modified
const ALLOWED_EXTENSIONS = [
  ".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".html", ".md", ".txt"
];

// Files that should never be modified
const BLOCKED_FILES = [
  "package.json",
  "package-lock.json",
  ".env",
  "drizzle.config.ts",
  "vite.config.ts",
  "tsconfig.json",
];

interface FileChange {
  file: string;
  operation: "replace" | "overwrite" | "append" | "prepend" | "delete";
  find?: string;
  replace_with?: string;
  content?: string;
}

interface ArcloPayload {
  changes: FileChange[];
  dry_run?: boolean;
  reason?: string;
}

interface ChangeResult {
  file: string;
  status: "updated" | "skipped" | "failed" | "dry_run";
  reason?: string;
  backup?: string;
}

// Logging helper
function logArcloAction(action: string, details: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, action, ...details };
  console.log(`[Arclo] ${JSON.stringify(logEntry)}`);
  
  // Append to log file
  const logDir = path.join(process.cwd(), "logs");
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  fs.appendFileSync(
    path.join(logDir, "arclo-changes.log"),
    JSON.stringify(logEntry) + "\n"
  );
}

// Validate file path security
function isPathAllowed(filePath: string): { allowed: boolean; reason?: string } {
  // Normalize path to prevent directory traversal
  const normalizedPath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, "");
  
  // Check for path traversal attempts
  if (normalizedPath.includes("..") || path.isAbsolute(normalizedPath)) {
    return { allowed: false, reason: "Path traversal not allowed" };
  }
  
  // Check blocked files
  const fileName = path.basename(normalizedPath);
  if (BLOCKED_FILES.includes(fileName)) {
    return { allowed: false, reason: "This file cannot be modified" };
  }
  
  // Check file extension
  const ext = path.extname(normalizedPath).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { allowed: false, reason: `File extension ${ext} not allowed` };
  }
  
  // Check if path starts with an allowed directory
  const isInAllowedDir = ALLOWED_PATHS.some(allowedPath => 
    normalizedPath.startsWith(allowedPath + "/") || normalizedPath.startsWith(allowedPath + "\\")
  );
  
  if (!isInAllowedDir) {
    return { 
      allowed: false, 
      reason: `File must be in allowed directories: ${ALLOWED_PATHS.join(", ")}` 
    };
  }
  
  return { allowed: true };
}

// Create backup of file before modification
function createBackup(filePath: string): string | null {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) return null;
    
    const backupDir = path.join(process.cwd(), "logs", "arclo-backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupName = `${path.basename(filePath)}.${timestamp}.bak`;
    const backupPath = path.join(backupDir, backupName);
    
    fs.copyFileSync(fullPath, backupPath);
    return backupPath;
  } catch (error) {
    return null;
  }
}

// API Key authentication middleware
export function arcloAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-arclo-api-key"] || req.headers["authorization"]?.replace("Bearer ", "");
  const expectedKey = process.env.ARCLO_API_KEY;
  
  if (!expectedKey) {
    logArcloAction("auth_error", { error: "ARCLO_API_KEY not configured", ip: req.ip });
    return res.status(500).json({ error: "Arclo integration not configured" });
  }
  
  if (!apiKey || apiKey !== expectedKey) {
    logArcloAction("auth_failed", { ip: req.ip, userAgent: req.headers["user-agent"] });
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  next();
}

// Main handler for applying changes
export async function handleApplyChanges(req: Request, res: Response) {
  const payload = req.body as ArcloPayload;
  const clientIp = req.ip || req.socket?.remoteAddress || "unknown";
  
  logArcloAction("request_received", { 
    ip: clientIp,
    changeCount: payload.changes?.length || 0,
    dryRun: payload.dry_run || false,
    reason: payload.reason
  });
  
  if (!payload || !Array.isArray(payload.changes)) {
    return res.status(400).json({ error: "Invalid payload: 'changes' array required" });
  }
  
  if (payload.changes.length === 0) {
    return res.status(200).json({ status: "completed", results: [], message: "No changes to apply" });
  }
  
  if (payload.changes.length > 20) {
    return res.status(400).json({ error: "Too many changes in single request (max 20)" });
  }
  
  const results: ChangeResult[] = [];
  const isDryRun = payload.dry_run === true;
  
  for (const change of payload.changes) {
    const { file, operation, find, replace_with, content } = change;
    
    // Validate path security
    const pathCheck = isPathAllowed(file);
    if (!pathCheck.allowed) {
      results.push({ file, status: "failed", reason: pathCheck.reason });
      logArcloAction("path_rejected", { file, reason: pathCheck.reason });
      continue;
    }
    
    const fullPath = path.join(process.cwd(), file);
    
    // Check file exists for operations that require it
    if (operation !== "overwrite" && !fs.existsSync(fullPath)) {
      results.push({ file, status: "failed", reason: "File not found" });
      continue;
    }
    
    try {
      let fileContent = fs.existsSync(fullPath) 
        ? fs.readFileSync(fullPath, "utf-8") 
        : "";
      let newContent = fileContent;
      
      switch (operation) {
        case "replace":
          if (!find) {
            results.push({ file, status: "failed", reason: "Missing 'find' parameter" });
            continue;
          }
          if (!fileContent.includes(find)) {
            results.push({ file, status: "skipped", reason: "Pattern not found in file" });
            continue;
          }
          newContent = fileContent.replace(find, replace_with || "");
          break;
          
        case "overwrite":
          if (content === undefined) {
            results.push({ file, status: "failed", reason: "Missing 'content' parameter" });
            continue;
          }
          newContent = content;
          break;
          
        case "append":
          if (content === undefined) {
            results.push({ file, status: "failed", reason: "Missing 'content' parameter" });
            continue;
          }
          newContent = fileContent + content;
          break;
          
        case "prepend":
          if (content === undefined) {
            results.push({ file, status: "failed", reason: "Missing 'content' parameter" });
            continue;
          }
          newContent = content + fileContent;
          break;
          
        case "delete":
          if (isDryRun) {
            results.push({ file, status: "dry_run", reason: "Would delete file" });
          } else {
            const backup = createBackup(file);
            fs.unlinkSync(fullPath);
            results.push({ file, status: "updated", reason: "File deleted", backup: backup || undefined });
            logArcloAction("file_deleted", { file, backup });
          }
          continue;
          
        default:
          results.push({ file, status: "failed", reason: `Unknown operation: ${operation}` });
          continue;
      }
      
      if (isDryRun) {
        results.push({ 
          file, 
          status: "dry_run", 
          reason: `Would ${operation} file (${newContent.length} chars)` 
        });
      } else {
        // Create backup before writing
        const backup = createBackup(file);
        
        // Ensure directory exists for new files
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(fullPath, newContent, "utf-8");
        results.push({ file, status: "updated", backup: backup || undefined });
        logArcloAction("file_updated", { file, operation, backup, contentLength: newContent.length });
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      results.push({ file, status: "failed", reason: errorMessage });
      logArcloAction("file_error", { file, error: errorMessage });
    }
  }
  
  const summary = {
    updated: results.filter(r => r.status === "updated").length,
    skipped: results.filter(r => r.status === "skipped").length,
    failed: results.filter(r => r.status === "failed").length,
    dryRun: results.filter(r => r.status === "dry_run").length,
  };
  
  logArcloAction("request_completed", { summary, dryRun: isDryRun });
  
  return res.status(200).json({
    status: "completed",
    dry_run: isDryRun,
    summary,
    results,
  });
}

// Health check handler
export function handleArcloHealth(req: Request, res: Response) {
  return res.status(200).json({ 
    status: "ok",
    service: "arclo-integration",
    timestamp: new Date().toISOString(),
    allowedPaths: ALLOWED_PATHS,
    allowedExtensions: ALLOWED_EXTENSIONS,
  });
}

// List allowed paths handler
export function handleListPaths(req: Request, res: Response) {
  return res.status(200).json({
    allowedPaths: ALLOWED_PATHS,
    allowedExtensions: ALLOWED_EXTENSIONS,
    blockedFiles: BLOCKED_FILES,
    maxChangesPerRequest: 20,
  });
}
