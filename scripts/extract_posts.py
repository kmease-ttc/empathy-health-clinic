#!/usr/bin/env python3
"""
Simplified WordPress post extractor
Handles multi-line INSERT statements
"""

import re
import html
from pathlib import Path

def unescape_sql_string(s):
    """Unescape SQL string"""
    if not s:
        return ""
    s = s.replace("\\'", "'")
    s = s.replace('\\"', '"')
    s = s.replace('\\\\', '\\')
    s = s.replace('\\n', '\n')
    s = s.replace('\\r', '\r')
    return html.unescape(s)

def parse_insert_line(line):
    """Parse a single INSERT line"""
    # Match: INSERT INTO `table` VALUES ('val1','val2',...);
    # Fields are: ID, author, date, date_gmt, content, title, excerpt, status, comment_status, ping_status, password, name(slug), to_ping, pinged, modified, modified_gmt, content_filtered, parent, guid, menu_order, type, mime_type, comment_count
    
    # Extract everything between VALUES ( and );
    match = re.search(r"VALUES\s*\((.*?)\);?\s*$", line, re.DOTALL)
    if not match:
        return None
    
    values_str = match.group(1)
    
    # Split by commas, but respect quotes
    fields = []
    current_field = ""
    in_quotes = False
    escape_next = False
    
    for char in values_str:
        if escape_next:
            current_field += char
            escape_next = False
            continue
        
        if char == '\\':
            escape_next = True
            current_field += char
            continue
        
        if char == "'" and not in_quotes:
            in_quotes = True
            current_field += char
        elif char == "'" and in_quotes:
            in_quotes = False
            current_field += char
        elif char == ',' and not in_quotes:
            fields.append(current_field.strip())
            current_field = ""
        else:
            current_field += char
    
    # Add last field
    if current_field:
        fields.append(current_field.strip())
    
    if len(fields) < 23:
        return None
    
    # Parse fields
    def parse_val(v):
        v = v.strip()
        if v == 'NULL':
            return None
        if v.startswith("'") and v.endswith("'"):
            return unescape_sql_string(v[1:-1])
        return v
    
    post = {
        'ID': parse_val(fields[0]),
        'post_date': parse_val(fields[2]),
        'post_content': parse_val(fields[4]),
        'post_title': parse_val(fields[5]),
        'post_excerpt': parse_val(fields[6]),
        'post_status': parse_val(fields[7]),
        'post_name': parse_val(fields[11]),
        'guid': parse_val(fields[18]),
        'post_type': parse_val(fields[20])
    }
    
    return post

def clean_content(html_content):
    """Clean HTML content"""
    if not html_content:
        return ""
    
    content = html_content
    
    # Remove WordPress blocks
    content = re.sub(r'<!-- wp:.*?-->', '', content, flags=re.DOTALL)
    
    # Basic HTML to markdown
    content = re.sub(r'<p>(.*?)</p>', r'\1\n\n', content, flags=re.DOTALL)
    content = re.sub(r'<br\s*/?>', '\n', content)
    content = re.sub(r'<strong>(.*?)</strong>', r'**\1**', content, flags=re.DOTALL)
    content = re.sub(r'<em>(.*?)</em>', r'*\1*', content, flags=re.DOTALL)
    content = re.sub(r'<h([1-6])>(.*?)</h\1>', lambda m: '#' * int(m.group(1)) + ' ' + m.group(2) + '\n', content, flags=re.DOTALL)
    content = re.sub(r'<li>(.*?)</li>', r'- \1\n', content, flags=re.DOTALL)
    content = re.sub(r'<a href="(.*?)".*?>(.*?)</a>', r'[\2](\1)', content, flags=re.DOTALL)
    content = re.sub(r'<[^>]+>', '', content)
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    return content.strip()

def main():
    sql_file = 'attached_assets/10.204.132.146-3306-db_dom376846_1761707182332.sql'
    output_dir = Path('blogs')
    output_dir.mkdir(exist_ok=True)
    
    print(f"Reading {sql_file}...")
    
    posts = []
    post_meta = {}
    attachments = {}
    
    with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
        in_posts_section = False
        in_postmeta_section = False
        buffer = ""
        line_count = 0
        
        for line in f:
            line_count += 1
            
            if line_count % 10000 == 0:
                print(f"  Line {line_count}... (found {len(posts)} posts)")
            
            # Track posts section
            if '`wp_wcv67wyb1p_posts`' in line and 'LOCK TABLES' in line:
                in_posts_section = True
                print(f"Found posts section at line {line_count}")
                continue
            elif in_posts_section and 'UNLOCK TABLES' in line:
                in_posts_section = False
                print(f"Finished posts section. Found {len(posts)} published posts")
                continue
            
            # Track postmeta section
            if '`wp_wcv67wyb1p_postmeta`' in line and 'LOCK TABLES' in line:
                in_postmeta_section = True
                print(f"Found postmeta section at line {line_count}")
                continue
            elif in_postmeta_section and 'UNLOCK TABLES' in line:
                in_postmeta_section = False
                print(f"Finished postmeta section")
                continue
            
            # Process posts
            if in_posts_section:
                if 'INSERT INTO' in line:
                    buffer = line
                else:
                    buffer += line
                
                # Check if complete statement
                if buffer.rstrip().endswith(';'):
                    post = parse_insert_line(buffer)
                    if post:
                        if post['post_type'] == 'post' and post['post_status'] == 'publish':
                            posts.append(post)
                        elif post['post_type'] == 'attachment':
                            attachments[post['ID']] = post
                    buffer = ""
            
            # Process postmeta (for featured images)
            if in_postmeta_section and 'INSERT INTO' in line:
                # Quick parse for _thumbnail_id
                if '_thumbnail_id' in line:
                    match = re.search(r"\('(\d+)','(\d+)','_thumbnail_id','(\d+)'\)", line)
                    if match:
                        post_id = match.group(2)
                        thumbnail_id = match.group(3)
                        if post_id not in post_meta:
                            post_meta[post_id] = {}
                        post_meta[post_id]['_thumbnail_id'] = thumbnail_id
    
    print(f"\n✓ Extraction complete!")
    print(f"  Published posts: {len(posts)}")
    print(f"  Attachments: {len(attachments)}")
    print(f"  Post metadata: {len(post_meta)}")
    
    # Save posts
    print(f"\nSaving posts to {output_dir}/...")
    
    for post in posts:
        # Get featured image
        featured_image = ""
        meta = post_meta.get(post['ID'], {})
        thumbnail_id = meta.get('_thumbnail_id')
        if thumbnail_id and thumbnail_id in attachments:
            featured_image = attachments[thumbnail_id]['guid'] or ""
        
        # Create slug
        slug = post['post_name'] or re.sub(r'[^a-z0-9]+', '-', post['post_title'].lower()).strip('-')
        
        # Clean content
        content = clean_content(post['post_content'])
        
        # Create markdown
        md = f"""---
title: "{post['post_title']}"
slug: "{slug}"
date: "{post['post_date']}"
excerpt: "{post['post_excerpt'] or ''}"
featured_image: "{featured_image}"
---

{content}
"""
        
        # Save file
        filename = f"{slug}.md"
        filepath = output_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(md)
        
        print(f"  ✓ {filename}")
    
    # Create index
    index = f"# WordPress Blog Posts\n\nTotal: {len(posts)}\n\n"
    for post in sorted(posts, key=lambda x: x['post_date'], reverse=True):
        slug = post['post_name'] or re.sub(r'[^a-z0-9]+', '-', post['post_title'].lower()).strip('-')
        index += f"- [{post['post_title']}]({slug}.md) - {post['post_date']}\n"
    
    with open(output_dir / 'index.md', 'w', encoding='utf-8') as f:
        f.write(index)
    
    print(f"\n✅ Done! All {len(posts)} posts saved to blogs/")

if __name__ == '__main__':
    main()
