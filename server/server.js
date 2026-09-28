const express=require("express");
const path=require("path");

const app=express();
const PORT=process.env.PORT||3000;

/* =========================================================
   CALVAROZ MAIN ROBLOX GROUP
========================================================= */
const GROUP_ID=34922741;

app.use(express.json());
app.use(express.static(path.join(__dirname,"../public")));

function validId(id){return /^\d+$/.test(String(id))}
async function roblox(url,opt={}){
  const r=await fetch(url,opt);
  const d=await r.json().catch(()=>({}));
  if(!r.ok){
    const e=new Error(d.errors?.[0]?.message||d.message||`Roblox API ${r.status}`);
    e.status=r.status;
    throw e;
  }
  return d;
}

/* Group data + LIVE role list.
   memberCount is read from Roblox instead of manual website data. */
app.get("/api/roblox/group/:groupId",async(req,res)=>{
  if(!validId(req.params.groupId))return res.status(400).json({error:"Invalid Roblox Group ID"});
  try{
    const id=req.params.groupId;
    const [group,roles]=await Promise.all([
      roblox(`https://groups.roblox.com/v1/groups/${id}`),
      roblox(`https://groups.roblox.com/v1/groups/${id}/roles`)
    ]);
    res.json({
      ...group,
      roles:Array.isArray(roles.roles)?roles.roles:[]
    });
  }catch(e){
    res.status(e.status||500).json({error:e.message})
  }
});

app.get("/api/roblox/user/:userId",async(req,res)=>{
  if(!validId(req.params.userId))return res.status(400).json({error:"Invalid Roblox User ID"});
  try{res.json(await roblox(`https://users.roblox.com/v1/users/${req.params.userId}`))}
  catch(e){res.status(e.status||500).json({error:e.message})}
});

app.get("/api/roblox/avatar/:userId",async(req,res)=>{
  if(!validId(req.params.userId))return res.status(400).json({error:"Invalid Roblox User ID"});
  try{
    const d=await roblox(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${req.params.userId}&size=420x420&format=Png&isCircular=false`);
    const url=d.data?.[0]?.imageUrl;
    if(!url)return res.status(404).json({error:"Avatar not found"});
    res.redirect(url);
  }catch(e){res.status(e.status||500).json({error:e.message})}
});

/* Search username -> verify membership -> return actual current group role. */
app.post("/api/roblox/search",async(req,res)=>{
  const username=String(req.body?.username||"").trim();
  if(!username)return res.status(400).json({error:"Username is required"});

  try{
    const s=await roblox("https://users.roblox.com/v1/usernames/users",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({usernames:[username],excludeBannedUsers:false})
    });
    const user=s.data?.[0];
    if(!user)return res.json({user:null,groupMember:false});

    const g=await roblox(`https://groups.roblox.com/v2/users/${user.id}/groups/roles`);
    const membership=g.data?.find(x=>Number(x.group?.id)===GROUP_ID);
    if(!membership)return res.json({user,groupMember:false});

    res.json({
      user,
      groupMember:true,
      group:membership.group,
      role:membership.role,
      rank:membership.role?.name||"MEMBER",
      rankId:membership.role?.id||0,
      numericRank:membership.role?.rank||0
    });
  }catch(e){
    console.error(e);
    res.status(e.status||500).json({error:e.message})
  }
});

app.get("/api/health",(req,res)=>res.json({ok:true,groupId:GROUP_ID}));

app.listen(PORT,"0.0.0.0",()=>console.log(`Calvaroz HQ running on port ${PORT} | GROUP_ID=${GROUP_ID}`));
