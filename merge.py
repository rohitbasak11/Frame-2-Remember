import re

def get_content(filename, start_marker, end_marker):
    with open(filename, 'r') as f:
        data = f.read()
    start = data.find(start_marker)
    if start == -1: return ""
    end = data.find(end_marker, start)
    if end == -1: return data[start:]
    return data[start:end]

# Read original index
with open('index.html', 'r') as f:
    orig_index = f.read()

# Core index starts from <!DOCTYPE until before <section id="portfolio" class="featured-work">
hero_end_marker = '<section id="portfolio" class="featured-work">'
hero_end_pos = orig_index.find(hero_end_marker)

header_and_hero = orig_index[:hero_end_pos]

# Get About
about_content = get_content('about.html', '<section class="about-hero container">', '</section>\n\n            <section class="values container">')
about_content2 = get_content('about.html', '<section class="values container">', '</section>\n\n            <footer id="footer">')
about_section = f'<div id="about">\n{about_content}</section>\n{about_content2}</section>\n</div>\n'

# Get Connect
connect_content = get_content('connect.html', '<section class="connect-hero container">', '<!-- Footer -->')
connect_section = f'<div id="connect">\n{connect_content}</div>\n'

# Get Portfolio
portfolio_content = get_content('portfolio.html', '<section class="portfolio-hero container">', '</main>')
portfolio_section = f'<div id="portfolio">\n{portfolio_content}</div>\n'

# Get Footer and bottom of index
footer_start_pos = orig_index.find('<footer id="footer">')
footer_and_bottom = orig_index[footer_start_pos:]

# Combine
new_index = header_and_hero + about_section + connect_section + portfolio_section + footer_and_bottom

with open('index.html', 'w') as f:
    f.write(new_index)

print("Merged successfully")
