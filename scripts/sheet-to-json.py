# Converts a Google Sheets API export (spreadsheets.get with includeGridData, formattedValue only)
# of the "Food Hub Funding Directory" sheet into data/directory.json.
# Usage: python3 scripts/sheet-to-json.py export.json data/directory.json
import json,sys
src,out=sys.argv[1],sys.argv[2]
d=json.load(open(src))["content"]["sheets"]
def rows(s):
    r=[]
    for row in s.get("data",[{}])[0].get("rowData",[]):
        r.append([ (c.get("formattedValue") or "").strip() for c in row.get("values",[])])
    return r
tabs={s["properties"]["title"]:rows(s) for s in d}
keys=["program","level","state","funds_what","hub_stage","award_range","match_requirement","cycle_deadline","eligibility_notes","url","date_verified"]
progs=[]
for tab in ["Directory","State Programs"]:
    for r in tabs[tab][1:]:
        if not r or not r[0]: continue
        r=r+[""]*(11-len(r))
        p=dict(zip(keys,r[:11]))
        p["none_found"]=p["program"].lower().startswith("none found")
        progs.append(p)
for i,p in enumerate(progs): p["id"]=i+1
# state summary
ss=tabs["State Summary"]
top=[];states=[];method=""
mode=None
for r in ss:
    if not r or not any(r): continue
    if r[0]=="Rank": mode="top";continue
    if r[0]=="State" and len(r)>1 and r[1]=="Research status": mode="sum";continue
    if r[0].startswith("Method"): method=r[0];continue
    if r[0]=="State summary": continue
    if mode=="top" and r[0].isdigit(): top.append({"rank":int(r[0]),"state":r[1],"why":r[2] if len(r)>2 else ""})
    elif mode=="sum":
        r=r+[""]*(6-len(r))
        states.append({"state":r[0],"status":r[1],"programs_found":int(r[2] or 0),"categories_none":int(r[3] or 0),"categories_unchecked":int(r[4] or 0),"largest_award":r[5]})
rank={t["state"]:t for t in top}
for s in states:
    t=rank.get(s["state"]); s["rank"]=t["rank"] if t else None; s["why"]=t["why"] if t else ""
json.dump({"programs":progs,"states":states,"method":method,"verified":"2026-11-22"},open(out,"w"),indent=1,ensure_ascii=False)
from collections import Counter
print(len(progs),Counter(p["level"] for p in progs),sum(p["none_found"] for p in progs),len(states),len(top))
print(Counter(p["hub_stage"] for p in progs).most_common(15))
print(sorted(set(p["state"] for p in progs)))
