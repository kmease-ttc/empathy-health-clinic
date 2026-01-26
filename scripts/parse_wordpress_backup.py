#!/usr/bin/env python3
"""
WordPress Database Parser
Extracts published blog posts from WordPress SQL dump
"""

import re
import json
import html
from pathlib import Path
from datetime import datetime

def unescape_sql_string(s):
    """Unescape SQL string literals"""
    if not s:
        return ""
    # Replace SQL escape sequences
    s = s.replace("\\'", "'")
    s = s.replace('\\"', '"')
    s = s.replace('\\\\', '\\')
    s = s.replace('\\n', '\n')
    s = s.replace('\\r', '\r')
    s = s.replace('\\t', '\t')
    return html.unescape(s)

def parse_sql_values(line):
    """Parse VALUES from INSERT statement"""
    # Extract the VALUES portion
    match = re.search(r'VALUES\s+\((.*)\);?$', line, re.DOTALL)
    if not match:
        return []
    
    values_str = match.group(1)
    records = []
    
    # Split by ),( to get individual records
    # Handle escaped quotes and parentheses
    current_record = []
    current_value = ""
    in_quotes = False
    escape_next = False
    paren_depth = 0
    
    i = 0
    while i < len(values_str):
        char = values_str[i]
        
        if escape_next:
            current_value += char
            escape_next = False
            i += 1
            continue
            
        if char == '\\':
            escape_next = True
            current_value += char
            i += 1
            continue
        
        if char == "'" and not in_quotes:
            in_quotes = True
            current_value += char
        elif char == "'" and in_quotes:
            in_quotes = False
            current_value += char
        elif char == ',' and not in_quotes and paren_depth == 0:
            # End of field
            current_record.append(current_value.strip())
            current_value = ""
        elif char == '(' and not in_quotes:
            paren_depth += 1
            current_value += char
        elif char == ')' and not in_quotes:
            if paren_depth > 0:
                paren_depth -= 1
                current_value += char
            else:
                # End of record
                if current_value.strip():
                    current_record.append(current_value.strip())
                if current_record:
                    records.append(current_record)
                current_record = []
                current_value = ""
                # Skip the comma after )
                if i + 1 < len(values_str) and values_str[i + 1] == ',':
                    i += 1
                # Skip the opening paren of next record
                if i + 1 < len(values_str) and values_str[i + 1] == '(':
                    i += 1
        else:
            current_value += char
        
        i += 1
    
    # Add last field/record if any
    if current_value.strip():
        current_record.append(current_value.strip())
    if current_record:
        records.append(current_record)
    
    return records

def parse_sql_value(val):
    """Parse a single SQL value"""
    val = val.strip()
    if val == 'NULL':
        return None
    if val.startswith("'") and val.endswith("'"):
        return unescape_sql_string(val[1:-1])
    return val

def extract_posts_from_sql(sql_file):
    """Extract all published posts from WordPress SQL dump"""
    print(f"Reading SQL file: {sql_file}")
    
    posts = {}
    post_meta = {}
    attachments = {}
    
    with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
        in_posts_section = False
        in_postmeta_section = False
        buffer = ""
        
        for line_num, line in enumerate(f, 1):
            if line_num % 10000 == 0:
                print(f"Processing line {line_num}...")
            
            # Detect posts table section
            if 'LOCK TABLES `wp_wcv67wyb1p_posts` WRITE' in line:
                in_posts_section = True
                print(f"Found posts section at line {line_num}")
                continue
            elif in_posts_section and 'UNLOCK TABLES' in line:
                in_posts_section = False
                print(f"Finished posts section at line {line_num}, found {len(posts)} posts")
                continue
            
            # Detect postmeta table section
            if 'LOCK TABLES `wp_wcv67wyb1p_postmeta` WRITE' in line:
                in_postmeta_section = True
                print(f"Found postmeta section at line {line_num}")
                continue
            elif in_postmeta_section and 'UNLOCK TABLES' in line:
                in_postmeta_section = False
                print(f"Finished postmeta section at line {line_num}")
                continue
            
            # Process posts
            if in_posts_section and line.strip().startswith('INSERT INTO'):
                buffer += line
                # Check if statement is complete
                if line.rstrip().endswith(';'):
                    records = parse_sql_values(buffer)
                    for record in records:
                        if len(record) >= 23:
                            post_id = parse_sql_value(record[0])
                            post_type = parse_sql_value(record[21])
                            post_status = parse_sql_value(record[8])
                            
                            # Store all posts (including attachments)
                            post_data = {
                                'ID': post_id,
                                'post_author': parse_sql_value(record[1]),
                                'post_date': parse_sql_value(record[2]),
                                'post_date_gmt': parse_sql_value(record[3]),
                                'post_content': parse_sql_value(record[4]),
                                'post_title': parse_sql_value(record[5]),
                                'post_excerpt': parse_sql_value(record[6]),
                                'post_status': post_status,
                                'post_name': parse_sql_value(record[11]),
                                'post_type': post_type,
                                'guid': parse_sql_value(record[18]),
                                'post_mime_type': parse_sql_value(record[22])
                            }
                            
                            if post_type == 'attachment':
                                attachments[post_id] = post_data
                            elif post_type == 'post' and post_status == 'publish':
                                posts[post_id] = post_data
                    
                    buffer = ""
            elif in_posts_section and not line.strip().endswith(';'):
                buffer += line
            
            # Process postmeta
            if in_postmeta_section and line.strip().startswith('INSERT INTO'):
                buffer += line
                if line.rstrip().endswith(';'):
                    records = parse_sql_values(buffer)
                    for record in records:
                        if len(record) >= 4:
                            post_id = parse_sql_value(record[1])
                            meta_key = parse_sql_value(record[2])
                            meta_value = parse_sql_value(record[3])
                            
                            if post_id not in post_meta:
                                post_meta[post_id] = {}
                            post_meta[post_id][meta_key] = meta_value
                    buffer = ""
            elif in_postmeta_section and not line.strip().endswith(';'):
                buffer += line
    
    print(f"\nExtraction complete:")
    print(f"  - Total published posts: {len(posts)}")
    print(f"  - Total attachments: {len(attachments)}")
    print(f"  - Posts with metadata: {len(post_meta)}")
    
    return posts, post_meta, attachments

def clean_html_content(html_content):
    """Convert WordPress HTML to cleaner format"""
    if not html_content:
        return ""
    
    content = html_content
    
    # Remove WordPress comments
    content = re.sub(r'<!-- wp:.*?-->', '', content, flags=re.DOTALL)
    
    # Convert common HTML tags
    content = re.sub(r'<p>(.*?)</p>', r'\1\n\n', content, flags=re.DOTALL)
    content = re.sub(r'<br\s*/?>', '\n', content)
    content = re.sub(r'<strong>(.*?)</strong>', r'**\1**', content, flags=re.DOTALL)
    content = re.sub(r'<em>(.*?)</em>', r'*\1*', content, flags=re.DOTALL)
    content = re.sub(r'<h1>(.*?)</h1>', r'# \1\n', content, flags=re.DOTALL)
    content = re.sub(r'<h2>(.*?)</h2>', r'## \1\n', content, flags=re.DOTALL)
    content = re.sub(r'<h3>(.*?)</h3>', r'### \1\n', content, flags=re.DOTALL)
    content = re.sub(r'<h4>(.*?)</h4>', r'#### \1\n', content, flags=re.DOTALL)
    content = re.sub(r'<ul>(.*?)</ul>', r'\1', content, flags=re.DOTALL)
    content = re.sub(r'<ol>(.*?)</ol>', r'\1', content, flags=re.DOTALL)
    content = re.sub(r'<li>(.*?)</li>', r'- \1\n', content, flags=re.DOTALL)
    content = re.sub(r'<a href="(.*?)">(.*?)</a>', r'[\2](\1)', content, flags=re.DOTALL)
    
    # Remove remaining HTML tags
    content = re.sub(r'<[^>]+>', '', content)
    
    # Clean up extra whitespace
    content = re.sub(r'\n{3,}', '\n\n', content)
    content = content.strip()
    
    return content

def save_posts_to_markdown(posts, post_meta, attachments):
    """Save posts as Markdown files"""
    output_dir = Path('blogs')
    output_dir.mkdir(exist_ok=True)
    
    print(f"\nSaving {len(posts)} posts to {output_dir}/")
    
    for post_id, post in posts.items():
        # Get metadata
        meta = post_meta.get(post_id, {})
        
        # Get featured image
        featured_image = None
        thumbnail_id = meta.get('_thumbnail_id')
        if thumbnail_id and thumbnail_id in attachments:
            featured_image = attachments[thumbnail_id]['guid']
        
        # Create slug for filename
        slug = post['post_name'] or re.sub(r'[^a-z0-9]+', '-', post['post_title'].lower()).strip('-')
        
        # Clean content
        content = clean_html_content(post['post_content'])
        
        # Create markdown file
        md_content = f"""---
title: "{post['post_title']}"
slug: "{slug}"
date: "{post['post_date']}"
excerpt: "{post['post_excerpt'] or ''}"
featured_image: "{featured_image or ''}"
---

{content}
"""
        
        # Save file
        filename = f"{slug}.md"
        filepath = output_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(md_content)
        
        print(f"  ✓ Saved: {filename}")
    
    # Create index file
    index_content = "# WordPress Blog Posts\n\n"
    index_content += f"Total posts extracted: {len(posts)}\n\n"
    index_content += "## Posts:\n\n"
    
    sorted_posts = sorted(posts.values(), key=lambda x: x['post_date'], reverse=True)
    for post in sorted_posts:
        slug = post['post_name'] or re.sub(r'[^a-z0-9]+', '-', post['post_title'].lower()).strip('-')
        index_content += f"- [{post['post_title']}]({slug}.md) - {post['post_date']}\n"
    
    with open(output_dir / 'index.md', 'w', encoding='utf-8') as f:
        f.write(index_content)
    
    print(f"\n✓ Created index file: {output_dir}/index.md")

if __name__ == '__main__':
    sql_file = 'attached_assets/10.204.132.146-3306-db_dom376846_1761707182332.sql'
    
    # Extract posts from SQL
    posts, post_meta, attachments = extract_posts_from_sql(sql_file)
    
    # Save as Markdown
    save_posts_to_markdown(posts, post_meta, attachments)
    
    print("\n✅ Blog post extraction complete!")
    print(f"   All posts saved to: blogs/")
