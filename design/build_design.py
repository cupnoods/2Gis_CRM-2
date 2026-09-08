from pathlib import Path
from html import escape
import json, zipfile

OUT = Path(__file__).parent
C = dict(ink='#18382D', muted='#68766E', green='#176B4B', soft='#E5EFE7', white='#FFFFFF', canvas='#F7F8F4', line='#DFE5DD', amber='#966021', pale='#FFF3DA', blue='#E8EFF8')

class SVG:
    def __init__(self,w=1440,h=1024):
        self.w,self.h=w,h
        self.a=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img"><title>Osh CRM design — illustrative data</title>']
        self.rect(0,0,w,h,'canvas')
    def color(self,c): return C.get(c,c)
    def rect(self,x,y,w,h,c='white',r=0,stroke=None):
        self.a.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{self.color(c)}"'+(f' stroke="{self.color(stroke)}"' if stroke else '')+'/>')
    def text(self,x,y,s,size=14,c='ink',weight=400):
        self.a.append(f'<text x="{x}" y="{y}" font-family="Inter, Arial, sans-serif" font-size="{size}" font-weight="{weight}" fill="{self.color(c)}">{escape(str(s))}</text>')
    def lines(self,x,y,lines,size=14,c='ink',weight=400,gap=22):
        for n,s in enumerate(lines):self.text(x,y+n*gap,s,size,c,weight)
    def line(self,x,y,x2,y2,c='line'):
        self.a.append(f'<path d="M{x} {y}H{x2}" stroke="{self.color(c)}"/>' if y==y2 else f'<path d="M{x} {y}L{x2} {y2}" stroke="{self.color(c)}"/>')
    def button(self,x,y,w,label,primary=False,h=44,target=None):
        if target:self.a.append(f'<g data-screen="{target}" style="cursor:pointer" role="button" aria-label="{escape(label)}">')
        self.rect(x,y,w,h,'green' if primary else 'white',8,None if primary else 'line')
        self.text(x+16,y+h/2+5,label,14,'white' if primary else 'ink',500)
        if target:self.a.append('</g>')
    def pill(self,x,y,w,label,c='soft',ink='green'):
        self.rect(x,y,w,28,c,7);self.text(x+10,y+19,label,12,ink,500)
    def icon(self,x,y,name,c='muted',size=20):
        paths={'grid':'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z','board':'M4 4h5v16H4z M15 4h5v10h-5z','check':'M5 12l4 4L19 6','chart':'M4 20V12 M12 20V4 M20 20V8','settings':'M4 7h16 M4 17h16 M9 4v6 M16 14v6','search':'M20 20l-5-5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0','star':'M12 3l2.8 5.8 6.4.9-4.6 4.5 1.1 6.4-5.7-3-5.7 3 1.1-6.4-4.6-4.5 6.4-.9Z','arrow':'M5 12h14 M13 6l6 6-6 6','phone':'M7 3H4c-1 0-1 2-1 3 0 8 7 15 15 15 1 0 3 0 3-1v-3l-5-2-2 2c-4-2-6-4-7-7l2-2Z','pin':'M12 21s7-8 7-12a7 7 0 0 0-14 0c0 4 7 12 7 12Z M14 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0','plus':'M12 4v16 M4 12h16'}
        self.a.append(f'<g transform="translate({x} {y}) scale({size/24})" fill="none" stroke="{self.color(c)}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="{paths.get(name,paths["grid"])}"/></g>')
    def shell(self,active='Directory'):
        self.rect(0,0,208,1024,'ink');self.text(24,72,'osh.',40,'white',700)
        self.text(24,119,'BUSINESS WORKSPACE',10,'soft',500)
        nav=[('Directory','grid','catalogue'),('Sales pipeline','board','pipeline'),('Tasks','check',None),('Insights','chart',None),('Settings','settings',None)]
        for n,(label,icon,target) in enumerate(nav):
            y=151+n*55
            if target:self.a.append(f'<g data-screen="{target}" style="cursor:pointer">')
            if label==active:self.rect(12,y,184,44,'#2D5143',8)
            self.icon(25,y+12,icon,'white' if label==active else 'soft')
            self.text(57,y+28,label,14,'white' if label==active else 'soft',600 if label==active else 400)
            if target:self.a.append('</g>')
        self.rect(16,864,176,82,'#244639',10);self.text(30,889,'A calmer way to grow.',12,'white',600)
        self.lines(30,911,['One city. Every opportunity.','Your team, in one place.'],10,'soft',gap=16)
        self.text(24,980,'Osh Consulting Group',12,'soft');self.text(24,1000,'Osh, Kyrgyzstan',11,'soft')
        self.text(240,46,'WORKSPACE  /  OSH, KYRGYZSTAN',11,'muted',500)
        self.text(1214,46,'EN / RU',12,'muted');self.rect(1310,24,32,32,'soft',16);self.text(1321,46,'A',13,'green',600);self.text(1352,46,'Alex',12,'muted')
    def mobile_shell(self,title,active='Directory'):
        self.text(20,30,'9:41',13,'ink',600);self.text(307,30,'•••  ▰',13,'ink')
        self.text(20,77,'osh.',28,'ink',700);self.text(275,73,'EN / RU',12,'muted');self.rect(344,52,28,28,'soft',14);self.text(353,72,'A',12,'green',600)
        self.text(20,123,title,26,'ink',600)
        self.rect(0,770,390,74,'white');self.line(0,770,390,770)
        for x,name,icon,target in [(30,'Directory','grid','mobile-catalogue'),(132,'Pipeline','board','pipeline'),(232,'Tasks','check',None),(320,'More','settings',None)]:
            if target:self.a.append(f'<g data-screen="{target}" style="cursor:pointer">')
            self.icon(x+9,781,icon,'green' if name==active else 'muted');self.text(x,821,name,11,'green' if name==active else 'muted',600 if name==active else 400)
            if target:self.a.append('</g>')
        self.rect(139,835,112,4,'ink',2)
    def end(self):return ''.join(self.a)+'</svg>'

def catalogue():
    s=SVG();s.shell();s.text(240,111,'Your next opportunity is here.',30,'ink',600)
    s.text(240,150,'Explore local businesses. Build relationships that last.',15,'muted')
    s.button(1100,83,112,'Export');s.button(1224,83,184,'+ Add company',True)
    s.rect(240,198,712,48,'white',8,'line');s.icon(255,212,'search');s.text(290,228,'Search by company, category or address…',14,'muted')
    s.button(964,198,172,'All filters · 3',h=48);s.button(1148,198,166,'Save segment',h=48)
    for x,w,t in [(240,166,'Restaurants  ×'),(418,155,'Rating 4.0+  ×'),(585,155,'Has phone  ×')]:s.pill(x,262,w,t)
    s.text(757,281,'Clear all',13,'green',500)
    s.text(240,345,'248 businesses',17,'ink',600)
    s.button(830,316,88,'Table',True);s.button(926,316,88,'Cards');s.button(1022,316,80,'Map');s.button(1114,316,220,'Rating: high to low')
    s.rect(240,382,1168,468,'white',12);s.rect(240,382,1168,48,'soft',12)
    cols=[(292,'COMPANY'),(574,'CATEGORY'),(738,'RATING'),(858,'CONTACTS'),(1026,'STATUS'),(1210,'OWNER')]
    for x,t in cols:s.text(x,411,t,11,'muted',600)
    data=[('Sulaiman Coffee','Central Osh','Café & coffee','4.8','124','Call · WhatsApp','In progress','Alex'),('Silk Road Kitchen','East district','Restaurant','4.7','86','Call · Website','Not yet','Nurai'),('Archa Bakery','Central Osh','Bakery','4.6','59','Call · WhatsApp','Worked with','Alex'),('Dostuk Restaurant','South district','Restaurant','4.5','112','Call · Instagram','Not yet','Unassigned'),('Ala-Too Bistro','Central Osh','Restaurant','4.4','42','Call · Website','In progress','Nurai')]
    for n,(name,addr,cat,rating,count,contacts,status,owner) in enumerate(data):
        y=430+84*n
        if n==0:s.rect(240,y,1168,84,'#F1F7F1')
        s.line(240,y+84,1408,y+84);s.rect(257,y+32,16,16,'white',3,'line')
        s.a.append('<g data-screen="company" style="cursor:pointer">');s.rect(284,y+8,270,68,'transparent');s.text(292,y+33,name,14,'ink',600);s.text(292,y+56,addr,12,'muted');s.a.append('</g>')
        s.text(574,y+43,cat,14);s.text(738,y+33,rating+' ★',14,'ink',500);s.text(738,y+55,count+' ratings',11,'muted');s.text(858,y+43,contacts,13,'green',500)
        s.pill(1026,y+24,137,status,'soft' if status!='Not yet' else 'canvas','green' if status!='Not yet' else 'muted')
        s.text(1210,y+43,owner,13);s.icon(1350,y+29,'star')
    s.text(240,890,'Showing 1–5 of 248 · Demo data',12,'muted');s.text(1090,890,'Previous    1    2    3    …    Next →',13,'green',500)
    return s.end()

def company():
    s=SVG();s.shell();s.text(240,104,'← Directory / Restaurants / Sulaiman Coffee',13,'muted')
    s.text(240,160,'Sulaiman Coffee',36,'ink',600);s.text(240,193,'Café & coffee · Central Osh · 4.8 ★ (124 ratings)',15,'muted')
    for x,w,t,p in [(240,118,'Call',True),(370,152,'WhatsApp',False),(534,145,'Instagram',False),(691,163,'☆ Favourite',False),(1168,240,'+ Add to pipeline',True)]:s.button(x,222,w,t,p,target='pipeline' if 'pipeline' in t else None)
    s.rect(240,294,420,656,'white',16);s.text(264,328,'BUSINESS DETAILS',11,'muted',600);s.text(264,363,'Directory information',21,'ink',600)
    for y,label,values in [(405,'ADDRESS',['Central Osh, Kyrgyzstan']),(479,'HOURS',['Open today · 08:00–22:00']),(553,'CONTACTS',['Phone number from 2GIS','Website · Instagram · WhatsApp'])]:
        s.text(264,y,label,10,'muted',600);s.lines(264,y+26,values,14)
    s.button(264,641,372,'Open in 2GIS ↗');s.line(264,710,636,710);s.text(264,739,'DECISION MAKER',11,'muted',600)
    s.text(264,774,'Aida · Business owner',15,'ink',500);s.text(264,799,'Preferred contact: WhatsApp',13,'muted');s.text(264,844,'+ Add a decision maker',13,'green',500)
    s.lines(264,895,['Illustrative company and contact details.','Your notes stay safe when source data refreshes.'],11,'muted',gap=18)
    s.rect(684,294,724,174,'soft',16);s.text(708,333,'Your relationship',20,'ink',600)
    for x,w,t in [(708,184,'In progress  ⌄'),(904,149,'Priority A  ⌄'),(1065,133,'Alex  ⌄'),(1210,174,'♡ Wishlist')]:s.button(x,353,w,t)
    s.text(708,435,'Tags:  Priority lead · Hospitality     + Add tag',13,'green',500)
    s.rect(684,488,724,98,'white',12);s.pill(708,506,103,'TODAY · 14:30','pale','amber');s.text(708,559,'Call Aida about the proposal',15,'ink',500);s.button(1226,515,158,'Mark done')
    s.rect(684,606,724,344,'white',16);s.text(708,645,'Notes & activity',20,'ink',600);s.text(1242,645,'Team notes  ⌄',12,'muted')
    s.rect(708,666,676,82,'canvas',8,'line');s.text(725,696,'Write a note…',14,'muted');s.text(725,729,'Visible to your team',11,'muted');s.button(1268,682,100,'Save',True)
    s.rect(708,777,28,28,'soft',14);s.text(717,797,'A',12,'green',600);s.text(748,796,'Alex',13,'ink',600);s.text(790,796,'Today, 10:20',11,'muted')
    s.lines(748,825,['Interested in a customer retention package.','Send the proposal before Thursday.'],14,gap=22)
    s.line(708,874,1384,874);s.text(708,907,'Moved to Contact made · Yesterday',12,'muted');s.text(708,931,'Edit note · Delete',11,'green')
    return s.end()

def pipeline():
    s=SVG();s.shell('Sales pipeline');s.text(240,111,'Turn conversations into clients.',30,'ink',600);s.text(240,150,'Keep every opportunity moving, one next step at a time.',15,'muted')
    s.button(1106,86,138,'Edit stages');s.button(1256,86,152,'+ New deal',True)
    for x,w,title,value in [(240,368,'OPEN PIPELINE · KGS','450,000 сом'),(640,368,'OPEN PIPELINE · USD','$2,000'),(1040,368,'NEXT ACTIONS','2 due today')]:
        s.rect(x,184,w,100,'white',12);s.text(x+20,212,title,10,'muted',600);s.text(x+20,253,value,27,'ink',600)
    s.button(240,309,172,'All assignees  ⌄');s.button(424,309,155,'All currencies  ⌄');s.text(1140,336,'8 deals · Demo data',12,'muted')
    columns=[('New','3 deals · 90,000 сом',240),('Contact made','2 deals · 160,000 сом',537),('Proposal','2 deals · 200,000 сом',834),('Negotiation','1 deal · $2,000',1131)]
    cards=[[("Menu consultation","Archa Bakery","30,000 сом","Alex · Tomorrow",'soft'),("Local growth plan","Ala-Too Bistro","40,000 сом","Nurai · Fri, 11 Sep",'soft'),("Team training","Dostuk Restaurant","20,000 сом","Unassigned · No task",'pale')],[("Retention package","Sulaiman Coffee","120,000 сом","Alex · Today, 14:30",'pale'),("Service audit","Silk Road Kitchen","40,000 сом","Nurai · Tomorrow",'soft')],[("Quarterly advisory","Central Market Co.","150,000 сом","Alex · Today, 16:00",'pale'),("Customer experience","Archa Bakery","50,000 сом","Nurai · Fri, 11 Sep",'soft')],[("Growth partnership","Osh Hospitality Group","$2,000","Alex · Overdue",'pale')]]
    for ci,(name,sub,x) in enumerate(columns):
        s.rect(x,382,277,562,'#EEF1EB',12);s.text(x+16,415,name,16,'ink',600);s.text(x+16,440,sub,11,'muted');s.text(x+248,415,'+',20,'muted')
        for i,(title,business,value,task,bg) in enumerate(cards[ci]):
            y=464+148*i;s.rect(x+12,y,253,134,'white',10,'line');s.text(x+27,y+28,title,14,'ink',600);s.text(x+27,y+50,business,12,'muted');s.text(x+27,y+78,value,17,'ink',600);s.pill(x+26,y+91,223,task,bg,'amber' if bg=='pale' else 'green')
    s.text(240,978,'Stages continue horizontally: Qualified · Meeting / diagnostic · Won · Lost',12,'muted');s.text(240,999,'Amounts stay separate by currency. Move a deal by dragging it or selecting a stage in its details.',11,'muted')
    return s.end()

def mobile_catalogue():
    s=SVG(390,844);s.mobile_shell('Find your next client.');s.text(20,148,'Osh directory · Demo data',12,'muted')
    s.rect(20,168,350,48,'white',10,'line');s.icon(34,182,'search');s.text(66,198,'Search businesses…',14,'muted')
    s.button(20,230,150,'Filters · 3');s.button(182,230,188,'Rating: high to low')
    s.pill(20,288,151,'Restaurants  ×');s.pill(181,288,137,'Rating 4.0+  ×');s.text(20,343,'248 businesses',15,'ink',600)
    for n,(title,cat,rating,status) in enumerate([('Sulaiman Coffee','Café & coffee','4.8 ★ · 124 ratings','In progress'),('Silk Road Kitchen','Restaurant','4.7 ★ · 86 ratings','Not yet')]):
        y=363+n*188;s.rect(20,y,350,172,'white',14,'line');s.a.append('<g data-screen="mobile-company" style="cursor:pointer">');s.rect(28,y+8,288,54,'transparent');s.text(36,y+32,title,18,'ink',600);s.text(36,y+57,cat+' · Central Osh',12,'muted');s.a.append('</g>');s.icon(330,y+17,'star');s.text(36,y+84,rating,12,'muted');s.pill(210,y+65,143,status)
        s.button(36,y+106,98,'Call',True);s.button(146,y+106,134,'WhatsApp');s.button(292,y+106,62,'→',target='mobile-company')
    s.text(20,751,'Showing 2 of 248 · Load more ↓',12,'muted');return s.end()

def mobile_company():
    s=SVG(390,844);s.mobile_shell('Sulaiman Coffee');s.text(20,149,'Café & coffee · Central Osh',13,'muted');s.text(20,174,'4.8 ★  (124 ratings)',13,'ink')
    s.button(20,191,104,'Call',True);s.button(134,191,145,'WhatsApp');s.button(289,191,81,'More')
    s.rect(20,254,350,153,'soft',14);s.text(36,284,'Your relationship',16,'ink',600);s.button(36,300,176,'In progress  ⌄');s.button(222,300,132,'Priority A  ⌄');s.text(36,379,'Alex · Priority lead · Hospitality',12,'green')
    s.rect(20,425,350,87,'white',12);s.text(36,451,'TODAY · 14:30',11,'amber',600);s.text(36,477,'Call Aida about the proposal',14,'ink',500);s.text(36,497,'Mark done',12,'green',500)
    s.rect(20,530,350,148,'white',14);s.text(36,559,'Notes',18,'ink',600);s.text(287,559,'+ Add',13,'green',600);s.text(36,585,'Alex · Today, 10:20 · Team note',11,'muted');s.lines(36,610,['Interested in a retention package.','Send the proposal before Thursday.'],13,gap=21);s.text(36,657,'Saved',11,'muted')
    s.button(20,698,350,'+ Add to pipeline',True,h=48,target='pipeline');return s.end()

screens={'catalogue':catalogue(),'company':company(),'pipeline':pipeline(),'mobile-catalogue':mobile_catalogue(),'mobile-company':mobile_company()}
names={'catalogue':'Business directory','company':'Company workspace','pipeline':'Sales pipeline','mobile-catalogue':'Mobile · directory','mobile-company':'Mobile · company'}
for k,svg in screens.items():(OUT/f'{k}.svg').write_text(svg,encoding='utf-8')
sections=''.join(f'<section id="{k}" class="screen {"active" if k=="catalogue" else ""}">{svg}</section>' for k,svg in screens.items())
buttons=''.join(f'<button data-screen="{k}" class="{"selected" if k=="catalogue" else ""}">{v}</button>' for k,v in names.items())
html='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Osh CRM · Design preview</title><style>
*{box-sizing:border-box}body{margin:0;background:#e7ebe4;color:#18382d;font:14px Inter,Arial,sans-serif}header{padding:20px 28px;background:#fff;border-bottom:1px solid #dfe5dd;display:flex;align-items:center;gap:24px;flex-wrap:wrap}h1{font-size:18px;margin:0}header p{margin:5px 0 0;color:#68766e;font-size:12px}nav{display:flex;gap:6px;flex-wrap:wrap}nav button{border:0;background:#f0f3ee;padding:11px 14px;border-radius:7px;cursor:pointer;color:#18382d}nav button.selected{background:#176b4b;color:white}main{padding:28px}.screen{display:none;margin:auto;max-width:1440px}.screen.active{display:block}.screen svg{display:block;width:100%;height:auto;box-shadow:0 12px 50px #18382d12;border-radius:12px}.screen[id^=mobile]{max-width:390px}footer{padding:0 28px 24px;color:#68766e;font-size:12px}a{color:#176b4b}button:focus-visible,[data-screen]:focus-visible{outline:3px solid #a6c278;outline-offset:3px}@media(max-width:700px){main{padding:12px}header{padding:16px}nav{gap:4px}nav button{padding:10px;font-size:12px}}
</style><header><div><h1>osh. / MVP design</h1><p>Five screen concepts · Sample data · Click a company to explore</p></div><nav>'''+buttons+'''</nav></header><main>'''+sections+'''</main><footer>Design preview only; filters and CRM edits are not implemented. <a href="https://www.figma.com/design/aUmnuKbSqWgmVqVRiwgl8O">Open the partial native Figma file</a> · Individual SVG files are included for manual import.</footer><script>
function show(id){document.querySelectorAll('.screen').forEach(e=>e.classList.toggle('active',e.id===id));document.querySelectorAll('nav button').forEach(e=>e.classList.toggle('selected',e.dataset.screen===id));location.hash=id;window.scrollTo(0,0)}document.addEventListener('click',e=>{const t=e.target.closest('[data-screen]');if(t)show(t.dataset.screen)});if(document.getElementById(location.hash.slice(1)))show(location.hash.slice(1));
</script></html>'''
(OUT/'preview.html').write_text(html,encoding='utf-8')
(OUT/'README.md').write_text('''# Osh CRM — MVP design

Open `preview.html` to review five screens. Navigation and company links switch between concepts; this is not a working CRM.

## Figma
Native file: https://www.figma.com/design/aUmnuKbSqWgmVqVRiwgl8O
Team: Alex Will's team.
The Figma Starter MCP limit stopped writes. The native file contains the completed catalogue, partially completed company screen, shared sidebar and business-row components, and color variables. Pipeline and mobile wrappers there remain empty.

The five SVG files contain the completed visual concepts. Drag them into Figma manually or use File > Place image. They contain vector shapes and SVG text, but do not preserve native Figma auto-layout, component links, or prototype interactions. Font substitution can occur if Inter is unavailable. The supplied preview uses Inter with Arial fallback.

## Visual direction
Forest green #18382D, action green #176B4B, warm canvas #F7F8F4, surface #FFFFFF, soft green #E5EFE7, muted text #68766E, border #DFE5DD, amber #966021.
Desktop: 1440 × 1024. Mobile: 390 × 844. Touch controls generally 44–48px high.

## Interaction intent
Directory → company → add to pipeline is the core flow. Filters combine; rating and contact shortcuts are visible on rows. Full filter drawer should include category tree, status, wishlist, favourites, priority, tags, assignee, rating/review counts, contact availability, and deal stage. These secondary states are not drawn in this first concept set.
Relationship edits never overwrite source data. Team notes and author-private notes must be clearly distinguished; owner access to private notes is an unresolved product decision.
Pipeline columns scroll horizontally and have an alternative stage selector for touch/keyboard use. Sample sums: KGS 450,000 and USD 2,000, intentionally not combined. Visible subset of configurable stages shown.
Main screens are English; EN/RU controls indicate planned localization, not a completed Russian screen set.

## Deferred design scope
Map/cards desktop variants, filter drawer, tasks, settings, dashboard, login, empty/loading/error states, deal editor, export progress, note privacy selector and 360px adaptation need a follow-up design pass. These five screens are core-flow concepts, not the complete ToR UI specification.

All company names, counts, ratings, people and deal values are illustrative, not verified 2GIS records.
''',encoding='utf-8')
state=json.loads((OUT/'figma-state.json').read_text(encoding='utf-8-sig'))
state.update(status='blocked_by_figma_starter_mcp_quota',completed=['native catalogue','native sidebar component','native business-row component','native colors','5 SVG screen concepts','preview'],partial=['native company'],empty=['native pipeline','native mobile catalogue','native mobile company'])
(OUT/'figma-state.json').write_text(json.dumps(state,indent=2),encoding='utf-8')
with zipfile.ZipFile(OUT/'osh-crm-design.zip','w',zipfile.ZIP_DEFLATED) as z:
    for name in ['preview.html','README.md',*[k+'.svg' for k in screens]]:z.write(OUT/name,name)
print('Created 5 SVG screens, preview.html, README.md, and osh-crm-design.zip')
