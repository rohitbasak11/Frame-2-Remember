import re

with open('index.html', 'r') as f:
    html = f.read()

# Replace client grid
client_start = html.find('<div class="photo-grid">')  # First one is client
client_end_str = '</div>\n                </div>\n\n                <!-- ── COLUMN 2: Personal Vision ── -->'
client_end = html.find(client_end_str)

new_client_grid = '''<div class="photo-grid" id="client-grid">
                        <a href="/gracewed10.webp" class="glightbox photo-card tall shuffle-card" data-gallery="client" data-title="Wedding — First Look"><img src="/gracewed10.webp" alt="Wedding first look" loading="lazy"></a>
                        <a href="/gracewed1.webp" class="glightbox photo-card mid shuffle-card" data-gallery="client" data-title="Wedding — Ceremony"><img src="/gracewed1.webp" alt="Wedding ceremony" loading="lazy"></a>
                        <a href="/diwalithaidance.webp" class="glightbox photo-card wide shuffle-card" data-gallery="client" data-title="Diwali Festival — Thai Dance"><img src="/diwalithaidance.webp" alt="Thai dance at Diwali" loading="lazy"></a>
                        
                        <div class="column-header" style="margin-top: 20px; position: relative; top: auto; background: var(--glass-bg); backdrop-filter: blur(10px); border: var(--glass-border); text-align: center; border-radius: 20px;">
                            <button id="btn-see-all-client" class="btn-text" style="background: none; border: none; cursor: pointer; color: var(--color-pink); font-size: 1rem; width: 100%;">See All Client Work &rarr;</button>
                        </div>
                    '''

html = html[:client_start] + new_client_grid + html[client_end:]

# Replace personal grid
personal_start = html.find('<div class="photo-grid">', client_start + len(new_client_grid))
personal_end_str = '</div>\n                </div>\n\n            </div>\n\n            <footer id="footer">'
personal_end = html.find('</div>\n                </div>\n\n            </div>')

new_personal_grid = '''<div class="photo-grid" id="personal-grid">
                        <a href="/birdbeachbnw.webp" class="glightbox photo-card tall shuffle-card" data-gallery="personal" data-title="Shore — Black &amp; White Study"><img src="/birdbeachbnw.webp" alt="Bird on beach black and white" loading="lazy"></a>
                        <a href="/f2r4.webp" class="glightbox photo-card mid shuffle-card" data-gallery="personal" data-title="Personal Vision — Composition I"><img src="/f2r4.webp" alt="Personal photography composition" loading="lazy"></a>
                        <a href="/street1.webp" class="glightbox photo-card wide shuffle-card" data-gallery="personal" data-title="Street — Urban Geometry"><img src="/street1.webp" alt="Street photography urban geometry" loading="lazy"></a>

                        <div class="column-header" style="margin-top: 20px; position: relative; top: auto; background: linear-gradient(135deg, rgba(0,200,230,0.12) 0%, rgba(232,93,154,0.12) 100%); text-align: center; border-radius: 20px;">
                            <button id="btn-see-all-personal" class="btn-text" style="background: none; border: none; cursor: pointer; color: var(--color-blue); font-size: 1rem; width: 100%;">See All Personal Work &rarr;</button>
                        </div>

                        <!-- Enquire CTA card -->
                        <div class="column-header" style="margin-top: 20px; position: relative; top: auto; background: var(--glass-bg); backdrop-filter: blur(10px);">
                            <div class="col-eyebrow" style="color: var(--color-text-muted);">Commission a Shoot</div>
                            <h2 style="font-size: 1.4rem;">Have a project in mind?</h2>
                            <p style="margin-bottom: 20px;">Whether it's a once-in-a-lifetime event or an artistic collaboration, let's create something together.</p>
                            <a href="/enquire.html" class="btn btn-primary" style="font-size: 0.9rem; padding: 12px 28px; letter-spacing: 1px;">Start a Conversation</a>
                        </div>
                    '''

html = html[:personal_start] + new_personal_grid + html[personal_end:]

with open('index.html', 'w') as f:
    f.write(html)

print("HTML Replaced!")
