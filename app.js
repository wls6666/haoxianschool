const $ = (s, root = document) => root.querySelector(s);
const app = $('#app');
const dialog = $('#searchDialog');
const input = $('#searchInput');
const saved = JSON.parse(localStorage.getItem('haoxian-progress') || '{}');
const state = { clues: new Set(saved.clues || []), seen: new Set(saved.seen || []), flags: saved.flags || {} };
const remember = () => localStorage.setItem('haoxian-progress', JSON.stringify({ clues:[...state.clues], seen:[...state.seen], flags:state.flags }));
const dateText = new Intl.DateTimeFormat('zh-CN', { year:'numeric', month:'long', day:'numeric', weekday:'short' }).format(new Date());
$('#today').textContent = dateText;
$('#visits').textContent = (286419 + Math.floor(Math.random() * 43)).toLocaleString('zh-CN');

function unlock(id) { if (!state.clues.has(id)) { state.clues.add(id); remember(); } }
function read(id) { state.seen.add(id); remember(); }
function flag(id, value=true) { state.flags[id]=value; remember(); }
function go(path) { location.hash = path; }
function canOpen(path) {
  const gates = {
    'article/sport':()=>state.clues.has('code'), 'student/HX2020-03219':()=>state.clues.has('code'), 'article/transfer':()=>state.clues.has('identity'), 'article/day':()=>state.clues.has('transfer'), 'article/exit':()=>state.clues.has('day'), 'archive/A-20200317-07':()=>state.clues.has('access'),
    'archive/2012-summary':()=>state.clues.has('entry'), 'archive/2012-change':()=>state.clues.has('tang'), 'archive/2012-change-old':()=>state.clues.has('tang'), 'archive/tang':()=>state.clues.has('tang-name'),
    'archive/zheng':()=>state.clues.has('tang-day'), 'oldsite/2004':()=>state.clues.has('zheng'), 'archive/zheng-version':()=>state.clues.has('oldsite'), 'archive/xu':()=>state.clues.has('pattern'), 'archive/chen':()=>state.clues.has('pattern'), 'archive/timeline':()=>state.clues.has('pattern'),
    'archive/ledger-yi':()=>state.clues.has('pattern'), 'archive/ledger':()=>state.clues.has('yi'), 'archive/minguo':()=>state.clues.has('ledger'), 'archive/b1':()=>state.clues.has('pattern') || state.clues.has('benefit'), 'archive/old-ritual':()=>state.clues.has('b1'), 'archive/fusheng':()=>state.clues.has('ledger') || state.clues.has('b1'),
    'archive/character-proof':()=>state.clues.has('unknown'), 'archive/character-table':()=>state.clues.has('xu-char'), 'archive/xu-folklore':()=>state.clues.has('xu'), 'archive/xu-raise':()=>state.clues.has('xu'), 'archive/xu-roster':()=>state.clues.has('raise'), 'archive/xu-eat':()=>state.clues.has('roster'), 'archive/xu-hall':()=>state.clues.has('xu'), 'archive/xu-well':()=>state.clues.has('hall'), 'archive/removal':()=>state.clues.has('roster'), 'archive/offering':()=>state.clues.has('eat') || state.clues.has('remove'),
    'archive/r0':()=>state.clues.has('b1') || state.clues.has('hall'), 'archive/lastday':()=>state.clues.has('r0') && state.clues.has('offering'), 'archive/voice':()=>state.clues.has('lastday'), 'archive/device':()=>state.clues.has('voice'), 'archive/device-2020':()=>state.clues.has('device'), 'archive/well-depth':()=>state.clues.has('cold'), 'archive/return':()=>state.clues.has('return'), 'archive/current-voice':()=>state.clues.has('current'),
    'archive/anniversary':()=>state.flags.burst4, 'archive/sessions':()=>state.clues.has('anniversary'), 'archive/old-status':()=>state.flags.burst5, 'archive/selected':()=>state.clues.has('stage6'), 'archive/lin':()=>state.clues.has('lin'), 'archive/lin-plan':()=>state.clues.has('lin-detail'), 'archive/safety':()=>state.clues.has('plan'), 'archive/xu-student':()=>state.flags.safety, 'archive/request':()=>state.flags.burst6, 'archive/final-choice':()=>state.flags.withdrawn
  };
  return !gates[path] || gates[path]();
}
function unavailablePage(){ return layout(`<div class="crumb">当前位置：首页 &gt; 内容不存在</div><section class="card locked"><b>您访问的内容不存在。</b><p>该页面可能已被删除、移动或暂时不可访问。</p></section>`); }
function article(title, date, body, foot = '编辑：校办公室　审核：教务处　浏览次数：1847') {
  return `<div class="crumb">当前位置：首页 &gt; 新闻中心 &gt; 正文</div><section class="card article"><h1>${title}</h1><div class="article-meta">发布时间：${date}　　来源：沪市好贤学校</div><div class="article-body">${body}</div><div class="article-foot">${foot}</div></section>`;
}
function side() { return `<aside><section class="card side-search"><h3>站内搜索</h3><div class="search-mini"><input id="inlineSearch" placeholder="请输入关键词"><button id="inlineSubmit">搜索</button></div><p>请使用网站内容、学生姓名或资料编号进行检索。</p></section><section class="card side-block"><h3>常用链接</h3><p><a href="#students/class2020" data-route>2020届历届班级</a></p><p><a href="#downloads" data-route>资料下载中心</a></p><p><a href="#history" data-route>校史数字馆</a></p><p><a href="#disclosure" data-route>校务公开</a></p></section></aside>`; }
function layout(content) { return `<div class="page-grid"><div>${content}</div>${side()}</div>`; }
const ordinaryNews = [
  ['开学','我校举行2026学年第一学期开学典礼','2026-08-24'], ['practice','我校初中部暑期社会实践活动圆满结束','2026-08-19'], ['admission','好贤学校2026年秋季招生咨询安排','2026-07-28'], ['library','校图书馆暑期馆藏整理工作完成','2026-08-15']
];
function home() { return `<div class="page-grid"><div><section class="hero"><div class="hero-text"><h1>崇德 · 笃学 · 明理 · 致远</h1><p>立德树人，培养具有健全人格的新时代青年</p><span>沪市好贤学校　HAOXIAN SCHOOL</span></div></section><section class="card" style="margin-top:22px"><h2 class="section-title">校园新闻 <small>更多 &gt;</small></h2><ul class="news-list">${ordinaryNews.map(n=>`<li><a href="#article/${n[0]}" data-route>${n[1]}</a><time>${n[2]}</time></li>`).join('')}<li><a href="#article/art" data-route>我校学生在2019年沪市青少年艺术展演中取得佳绩</a><time>2019-05-24</time></li></ul></section><div class="home-bottom"><section class="card"><h2 class="section-title">通知公告</h2><div class="notice-list"><p>2026学年第一学期学生返校安排 <span>08-22</span></p><p>关于校园体育场开放时间的公告 <span>08-18</span></p><p>2026年秋季招生咨询安排 <span>07-28</span></p></div></section><section class="card"><h2 class="section-title">学生天地</h2><div class="notice-list"><p><a href="#students/class2020" data-route>历届班级 · 2020届初三年级</a></p><p>校园艺术节作品展示</p><p>学生社团活动纪实</p></div></section></div></div>${side()}</div>`; }
function simplePage(title, content) { return layout(`<div class="crumb">当前位置：首页 &gt; ${title}</div><section class="card article"><h1>${title}</h1><div class="article-meta">沪市好贤学校</div><div class="article-body">${content}</div></section>`); }
function classPage(){ unlock('class'); read('class'); const names=['陈子墨','王雨桐','周诚','林悦然','许佳怡','郑浩然','唐雨菲','赵思源','吴晓萌','张一帆','孙佳宁','何子昂','周心怡','李闻宇','方可欣','陈致远','刘雨晴','蒋文哲','高婧','林航','郭子轩','沈书怡','罗可','钱嘉宁','章远','徐晓童','宋承泽','顾欣妍','袁浩','马若琳','邵知远','冯欣然','程宇','梁静怡','秦思远','陆子涵','周奕','谢文婧','彭浩轩','戴雨珊','赵可言']; return layout(`<div class="crumb">当前位置：首页 &gt; 学生天地 &gt; 历届班级 &gt; 2020届</div><section class="card"><h1 class="section-title">2020届初三（2）班</h1><div class="article-body" style="padding:18px 24px"><p class="no-indent">班主任：赵文静　　班级人数：<b>42人</b></p><p>初三（2）班是一个团结、积极、富有活力的集体。在三年的学习生活中，同学们相互帮助、共同成长。</p></div><h2 class="section-title">学生名单 <small>共42名学生</small></h2><div class="class-list">${names.map((n,i)=>`<span>${String(i+1).padStart(2,'0')}　${n}</span>`).join('')}</div></section>`); }
function downloads(){ unlock('code'); read('downloads'); return layout(`<div class="crumb">当前位置：首页 &gt; 资料下载</div><section class="card"><h1 class="section-title">资料下载</h1><div class="download"><span>2026学年校历（PDF）<small>　2026-07-01</small></span><button>下载</button></div><div class="download"><span>学生综合素质评价办法（DOC）<small>　2025-09-01</small></span><button>下载</button></div><div class="download"><span><a href="#document/accounts" data-route>2020届学生图书馆账号初始化说明（TXT）</a><small>　2020-02-28</small></span><button data-route="#document/accounts">查看</button></div></section>`); }
function documentPage(name){ let doc = name === 'accounts' ? `图书馆系统账号规则：\n\n初中毕业年级账号由学籍系统自动生成。\n账号格式：HX + 入学年份 + 五位学生序号\n\n系统测试数据：\nHX2020-03215　正常\nHX2020-03216　正常\nHX2020-03217　正常\nHX2020-03218　正常\nHX2020-03220　正常\nHX2020-03221　正常\nHX2020-03222　正常` : ''; return layout(`<div class="crumb">当前位置：首页 &gt; 资料下载 &gt; 文档预览</div><section class="card article"><h1>2020届学生图书馆账号初始化说明</h1><div class="article-meta">TXT 文本预览　上传时间：2020-02-28</div><div class="doc">${doc}</div></section>`); }
function genericArticle(kind){ const map={
  开学:['我校举行2026学年第一学期开学典礼','2026-08-24','<p>8月24日上午，沪市好贤学校2026学年第一学期开学典礼在学校体育场举行。</p><p>全体师生齐聚校园，共同开启新学年的学习与生活。校长周敬川在讲话中勉励同学们保持好奇、坚持阅读、勇于实践。</p>'],
  practice:['我校初中部暑期社会实践活动圆满结束','2026-08-19','<p>为丰富学生暑期生活，增强社会责任意识，我校初中部于暑假期间组织开展“认识城市、服务社区”主题社会实践活动。</p>'],
  admission:['好贤学校2026年秋季招生咨询安排','2026-07-28','<p>为方便家长了解学校办学情况，我校将于近期开放线上招生咨询服务。</p>'],
  library:['校图书馆暑期馆藏整理工作完成','2026-08-15','<p>暑假期间，学校图书馆完成年度馆藏盘点及部分书库调整工作。本次整理完成图书数据核验八万余册。</p>'],
  art:['我校学生在2019年沪市青少年艺术展演中取得佳绩','2019-05-24','<p>近日，2019年沪市青少年艺术展演活动顺利举行。我校多名学生参加器乐、声乐及美术类项目，并取得良好成绩。</p><p>初二年级学生在器乐类项目中表现突出，其中初二（4）班周若宁获得器乐组一等奖，初二（1）班林佳怡获得器乐组二等奖。</p><p>学校向获奖同学表示祝贺，并感谢指导教师的辛勤付出。</p>']}; const d=map[kind]||map.开学; if(kind==='art') read('art'); return article(d[0],d[1],d[2]); }
function awards(old=false){ if(old) unlock('identity'); read(old?'awards-old':'awards'); const list=old?'陈子墨<br>王雨桐<br><b>叶紫贤</b><br>周诚<br>林悦然<br>许佳怡':'陈子墨<br>王雨桐<br>周诚<br>林悦然<br>许佳怡'; return article('2019学年度第一学期优秀学生表彰名单','2020-01-07',`<p>根据《沪市好贤学校学生综合评价实施办法》，经班级推荐、年级审核，现将2019学年度第一学期优秀学生名单公布如下。</p><p class="no-indent">初三（2）班：<br>${list}</p><p class="no-indent"><a href="#article/awards-old" data-route>查看旧版本（2020-01-07 09:14 上传版本）</a></p>`, old?'当前显示：历史版本<br>文件修改记录：2020-03-20 04:12 文件重新上传　操作账户：web_admin':'附件：2019学年度第一学期优秀学生名单.xlsx　　页面已更新：2020-03-20'); }
function sport(){ unlock('identity'); read('sport'); return article('2019年秋季运动会成绩汇总','2019-10-18',`<p class="no-indent">女子800米：</p><p class="no-indent">第一名　周若宁　初三（4）班　2分46秒71<br><b>第二名　叶紫贤　初三（2）班　2分49秒08</b><br>第三名　陈佳宁　初三（1）班　2分51秒44</p><p class="no-indent">学生编号：<b>HX2020-03219</b></p>`); }
function transfer(){ unlock('transfer'); read('transfer'); return article('2020年春季学籍变动情况汇总','2020-03-18',`<div class="doc">HX2020-03174　休学\nHX2020-03206　转入\n<b>HX2020-03219　转出</b>\nHX2020-03302　转出\n\n转出日期：2020-03-18\n理由：家庭原因\n去向学校：—\n手续编号：—\n办理人：教务处\n\n前次在校状态更新：2020-03-17 16:04</div><p>同日材料交接清单中，编号03219的“手续”“材料”均为空。</p>`); }
function dayPage(){ unlock('day'); read('day'); return article('2020年3月17日校园历史记录','历史系统导出',`<div class="timeline"><div><time>08:03:14　东门门禁</time>CARD：HX2020-03219　　ACTION：ENTRY　　RESULT：SUCCESS</div><div><time>11:41:32　第二食堂</time>ACCOUNT：HX2020-03219　　消费：12.50 元</div><div><time>13:08:47　图书馆系统</time>USER：HX2020-03219　　ACTION：RETURN　　BOOK：JZ-2017-4481</div><div><time>15:52:06　校园网络</time>USER：HX2020-03219　　AP：ZHL-3F-04　　STATUS：CONNECTED</div></div>`); }
function exitPage(){ unlock('access'); read('exit'); return article('旧门禁综合查询','历史查询',`<div class="doc">姓名：叶紫贤\n学生编号：HX2020-03219\n日期：2020-03-17\n\n08:03:14　东门　进入\n16:04:52　综合楼设备区　进入\n\n离校记录：<b>NULL</b>\n学籍备注：2020-03-18 因家庭原因转出。</div><p>系统提示：数据可能因旧门禁设备故障存在缺失，仅供历史查询参考。</p>`); }
function deleted(){ read('deleted'); return layout(`<div class="crumb">当前位置：首页 &gt; 新闻中心 &gt; 内容不存在</div><section class="card locked"><b>您访问的内容不存在。</b><p>该页面可能已被删除、移动或暂时不可访问。</p><p>页面 ID：1843</p><button class="text-button" data-route="#home">返回首页</button></section>`); }
function finalEntry(){ unlock('entry'); read('entry'); return layout(`<div class="crumb">当前位置：首页 &gt; 历史档案</div><section class="card locked"><b>无权访问该档案</b><p>当前资料属于历史学生事务归档内容。如需查询，请通过档案编号或相关事项名称检索公开资料。</p><div class="doc" style="text-align:left">档案编号：A-20200317-07\n归档部门：学生事务办公室\n建立日期：2020-03-18\n关联事项：<a href="#search/%E5%AD%A6%E7%94%9F%E5%BC%82%E5%B8%B8%E7%A6%BB%E6%A0%A1" data-route>学生异常离校</a></div></section>`); }

function archive2012(){ unlock('tang'); read('archive2012'); return article('2012年11月学生事务情况汇总','2012-11-09',`<p>近期，初中部各年级整体教学秩序稳定。学生事务办公室对本月考勤、请假、转学及特殊情况进行了统一核查。</p><p>截至11月9日，共办理病假长期备案3人，转学手续2人，休学手续1人。各年级应继续做好学生考勤记录，发现异常情况及时联系家长，并向学生事务办公室备案。</p><p class="no-indent"><a href="#archive/2012-change" data-route>附件：2012年11月学籍变动汇总.xls</a></p>`); }
function change2012(){ read('change2012'); return layout(`<div class="crumb">当前位置：首页 &gt; 历史档案 &gt; 表格预览</div><section class="card article"><h1>2012年11月学籍变动汇总</h1><div class="article-meta">XLS 历史预览　当前公开版本</div><div class="doc">编号　　　　年级　　类型　　日期\nHX12-0217　初二　　转入　　2012-11-02\nHX12-0241　初二　　转出　　2012-11-05\nHX12-0298　初三　　休学　　2012-11-06\nHX12-0314　初二　　转出　　2012-11-08</div><p class="article-body no-indent"><a href="#archive/2012-change-old" data-route>旧版字段预览</a></p></section>`); }
function change2012old(){ unlock('tang-name'); return layout(`<div class="crumb">当前位置：首页 &gt; 历史档案 &gt; 表格旧版</div><section class="card article"><h1>2012年11月学籍变动汇总</h1><div class="article-meta">历史版本　字段预览</div><div class="doc">HX12-0217　周成远　初二（1）班　转入\n<b>HX12-0241　唐珞　初二（4）班　转出</b>\nHX12-0298　方雨彤　初三（3）班　休学\nHX12-0314　李俊熙　初二（2）班　转出</div></section>`); }
function tangPage(){ unlock('tang-day'); read('tang'); return article('唐珞历史记录汇总','2012年历史系统导出',`<p class="no-indent">学生：唐珞　　班级：初二（4）班　　图书馆账号：HX12-0241</p><p>2011学年校园广播站成员名单与2012年市青少年作文比赛校内获奖名单的搜索摘要均保留唐珞姓名，但公开正文已被修订。</p><div class="doc">2012-11-05 07:42　西门　ENTRY\n2012-11-05 12:08　第一食堂　消费成功\n2012-11-05 14:26　图书馆　借阅\n2012-11-05 16:13　综合楼　ACCESS\n\nEXIT：NULL\n\n学籍状态：转出\n原因：家庭搬迁\n接收学校：—</div><p>次日（11月6日）综合楼发布“临时检修”通知。</p>`); }
function zhengPage(){ unlock('zheng'); read('zheng'); return article('2004学年学生异动情况备案','2004-04-16',`<div class="doc">姓名：郑岚\n班级：初二（3）班\n类型：转出\n日期：2004-04-16\n原因：家庭原因\n接收学校：—\n手续编号：—</div><p>旧校园卡资料的最后记录为：2004-04-15 17:02，综合楼。第二天，学校发布《关于老综合楼消防设施维修的通知》。</p><p class="no-indent"><a href="#oldsite/2004" data-route>查看2004年历史网站存档</a></p>`); }
function oldsite(){ unlock('oldsite'); return `<div class="oldsite"><div class="oldsite-head"><b>沪市好贤学校</b><span>设为首页　|　加入收藏</span></div><div class="oldsite-nav">学校简介　 校园新闻　 教育教学　 学生园地　 校友留言</div><div class="oldsite-body"><h1>初二（3）班学生名册</h1><p>最后修改：2004-04-15　　共38人</p><div class="doc">……\n周　璐　　钱佳宁　　<b>郑　岚</b>　　徐子航\n……</div><p><a href="#archive/zheng-version" data-route>查看历史版本记录</a></p><hr><h3>校园新闻</h3><p>好贤学校第四届田径运动会闭幕</p><p>关于开展校园普通话宣传周活动的通知</p><p>校园网络一期改造顺利完成</p></div><div class="oldsite-foot">版权所有：沪市好贤学校　最佳浏览 1024×768</div></div>`; }
function zhengVersion(){ unlock('pattern'); return layout(`<div class="crumb">当前位置：首页 &gt; 旧站存档 &gt; 历史版本</div><section class="card article"><h1>初二（3）班学生名册</h1><div class="article-meta">页面版本记录</div><div class="doc">2004-04-15　共38人　　包含：郑岚\n2004-04-17　共37人　　郑岚已不在名单中\n\n备注：未发现转学说明。</div></section>`); }
function earlierPage(kind){ const data={xu:['1994年度学生学籍异动登记','许明川','初二甲班','1994-09-23','随父母迁居','《1994年9月值班登记抄录》：初二甲班一生放学未归。家属已到校。旧资料室门未锁。'],chen:['1987年秋季学生变动登记','陈惠兰','初二乙班','1987-10-12','家事','十月十二日，晚六时后仍有学生一名未归。班主任与家长来校查问。第二天记录：校方已处理。']}; const d=data[kind]; unlock(kind); return article(d[0],d[3],`<div class="doc">姓名：${d[1]}\n班级：${d[2]}\n离校日期：${d[3]}\n原因：${d[4]}\n手续：缺</div><p>${d[5]}</p><p>此后不久，学校分别获得扩建用地或扩建计划批复。</p>`); }
function timelinePage(){ unlock('benefit'); return layout(`<div class="crumb">当前位置：首页 &gt; 校史馆 &gt; 大事记</div><section class="card article"><h1>好贤学校大事记（历史资料摘录）</h1><div class="article-meta">按年份浏览</div><div class="timeline"><div><time>1987 年</time>陈惠兰离校后，学校扩建计划获批。</div><div><time>1994 年</time>许明川离校后，学校新校区土地使用问题取得重要进展。</div><div><time>2004 年</time>郑岚转出后，学校改制方案正式获批。</div><div><time>2012 年</time>唐珞转出后，新校区二期工程获得批准。</div><div><time>2020 年</time>叶紫贤转出后，新校区规划正式获批，教育发展基金获得大额捐赠。</div></div><p>所有条目原本看起来都是学校发展史的一部分。</p></section>`); }
function oldLedger(kind){ const pages={yi:['1931年杂项账册','民国二十年春\n购木料　银三十七元\n修东舍　银五十二元\n添课桌　银十六元\n\n秋　<b>奉一</b>\n冬　田租增','“奉一”夹在普通账目中，没有宾语或解释。'],ledger:['1987年度校务杂记数字化摘录','八月　扩建批复仍无消息。\n九月　周董再赴有关部门。\n十月十二　<b>奉一。</b>\n十一月　扩建事项有进展。','陈惠兰最后出现的日期正是十月十二日。'],minguo:['民国十九年校董杂录','是年学款不足。\n\n周氏议：\n财势渐败。\n宜照旧例。\n<b>奉生一。</b>\n\n奉于 —— □','原文字符识别异常。']}; const d=pages[kind]; if(kind==='yi') unlock('yi'); if(kind==='ledger') unlock('ledger'); if(kind==='minguo') unlock('unknown'); return article(d[0],'历史资料数字化版本',`<div class="doc">${d[1]}</div><p>${d[2]}</p>${kind==='minguo'?'<p class="no-indent"><a href="#archive/character-proof" data-route>查看字符校对记录</a></p>':''}`); }
function b1Page(){ unlock('b1'); return article('综合楼旧服务器设备维护记录','2016-06-14',`<div class="doc">设备：ZHL-ARCHIVE-01\n位置：综合楼旧档案区\n维护项目：硬盘更换\n备注：B1 网络条件较差\n\n2020-03-17 16:21:08　ZHL-STAIR-B1　HX2020-03219　DENIED\n16:21:31　CARD：UNKNOWN　SUCCESS\n16:29:04　ZHL-ARCHIVE-01　HX2020-03219　LOGIN SUCCESS</div><p>2026年校园设施介绍只列出综合楼地上1—5层。2004年设备图却保留了：B1 / 档案 / 设备 / 总务储藏。</p>`); }
function unknownFile(){ unlock('fusheng'); return layout(`<div class="crumb">当前位置：首页 &gt; 私有档案 &gt; 文件预览</div><section class="card article"><h1>old_ritual_record</h1><div class="article-meta">文件损坏或编码格式无法识别</div><div class="doc">路径：/archive/private/old_ritual_record\n原始年代：不详\n数字化：2008\n类别：旧礼 / 校董旧存\n关键词：[无法显示]　奉　生</div><p class="article-body no-indent">旧档案全文检索命中：《旧例杂录·残》</p><p class="article-body no-indent"><a href="#archive/fusheng" data-route>打开资料</a></p></section>`); }
function fushengPage(){ return article('旧例杂录·残','约民国初年',`<div class="doc">好贤有旧例。\n非大事，不可行。\n行则择册中者。\n\n……<b>奉生</b>……\n……不得告家……\n……除其名……\n……事毕……\n……财势……\n\n财势复。</div><p>页面中的残字仍无法显示。</p><p class="no-indent"><a href="#archive/minguo" data-route>关联资料：民国十九年校董杂录</a></p>`); }

function characterProof(){ unlock('xu-char'); return layout(`<div class="crumb">当前位置：首页 &gt; 校史数字馆 &gt; 字符校对记录</div><section class="card article"><h1>1930_board_misc_07 字符校对记录</h1><div class="article-meta">OCR 版本：v2.1　　异常字符位置：第17行 / 第4字</div><div class="doc">2008-07-14　自动识别失败\n2008-07-16　人工标记：疑似鬼部生僻字\n2008-07-18　校对人员A：旧档多见，建议暂保留原字形。\n2008-07-18　校对人员B：现代字库无对应？\n2008-07-21　管理员：不要录入公开检索。</div></section>`); }
function characterTable(){ unlock('xu'); return layout(`<div class="crumb">当前位置：首页 &gt; 校史数字馆 &gt; 校对表</div><section class="card article"><h1>民国校董档案异体字校对表</h1><div class="article-meta">校史资料室整理</div><div class="doc">原字：塾　　OCR：塾　　备注：正常\n原字：圩　　OCR：圩　　备注：正常\n原字：饩　　OCR：饩　　备注：正常\n\n原字：[图片缺失]\nOCR：�\n部首：鬼\n右部：虚\n读音：xu\n备注：本校旧档专用字，统一录作 <b>“魖”</b>。</div></section>`); }
function xuPage(kind){ const data={
  folklore:['贤塘旧俗摘录','清末抄本','贤塘旧有异俗。\n\n乡人不言祀神，言“<b>养魖</b>”。\n\n魖不受香，不受纸，不受牲。\n凡有所求，不可拜。\n\n若求财、求地、求势，则以生名奉之。\n事成，曰“魖食”。\n\n后文缺失。'],
  raise:['旧例杂录·卷二','民国初年','养魖非祀神事。\n\n祀者求庇，养者求用。\n魖有应，亦有索。\n有求必偿。\n财势愈大，其索愈重。\n\n周氏旧戒三：\n一，不可妄奉。\n二，不可绝食。\n三，不可使外人知。\n\n得其利者，自当偿之。'],
  roster:['旧例杂录·名册篇','民国初年','魖食不可取外人。\n外人无籍，不入其门。\n必取册中之名。\n名在册久，方为“生”。\n\n既定，则先除其名。\n名尽，人后入。\n\n除名非为避查。乃旧礼之一。\n先去其名，使其无归。'],
  eat:['旧礼释词残页','年代不详','魖不食五谷，不食牲，不食香火。\n\n<b>所食者，人也。</b>\n\n旧本多避“人”字，以“生”代之。'],
  hall:['1964年校舍修缮附记','1964','扩建东侧校舍。\n旧井周围不得动土。\n原魖堂墙体保留。\n新墙由外包覆。\n入口仍留内侧。\n参与施工者不得擅入。\n\n此处不列公开图。'],
  well:['方井旧俗记录','民国旧礼','魖堂无像。\n堂中一牌，一桌，一井。\n井方。\n\n不得测深。\n不得投物。\n不得照。']
 }; const d=data[kind]; if(kind==='folklore') unlock('raise'); if(kind==='raise') unlock('roster'); if(kind==='roster') unlock('remove'); if(kind==='eat') unlock('eat'); if(kind==='hall') unlock('hall'); return article(d[0],d[1],`<div class="doc">${d[2]}</div>`); }
function removalPage(){ return article('学生档案处理旧规','1986',`<p>对特殊离校学生，应统一处理以下资料：</p><div class="doc">1. 学籍表\n2. 班级名册\n3. 获奖记录\n4. 校刊记录\n5. 活动登记\n6. 图书馆记录\n\n备注：须尽量避免残名。</div><p>旧后台任务显示，陈惠兰、许明川、唐珞与叶紫贤的资料均在最后出现日前被逐项修改。</p>`); }
function offeringPage(){ unlock('offering'); return article('2020年第一季度内部事项摘要','2020-02-21',`<div class="doc">旧例：启\n所求：新校区\n奉生：<b>已定</b>\n对象：03219\n姓名字段：已隐藏\n\n确认权限：董事长 / 校长 / 校务副校长</div><p>相关账户：ZJC-BOARD、SQM-MASTER、LWX-ADMIN。普通教师未参与该项处理。</p>`); }
function r0Page(){ unlock('r0'); return layout(`<div class="crumb">当前位置：首页 &gt; 旧服务器 &gt; 建筑资料</div><section class="card article"><h1>综合楼B1旧平面说明</h1><div class="article-meta">ZHL-ARCHIVE-01 本地资料</div><div class="doc">B1：\n楼梯　旧档案室　设备间　储藏　废弃水泵间\n\n设备间北墙后部：<b>R-0</b>\n图纸：未公开\n\nR-0　禁止进入\n责任部门：校董会办公室</div><p class="article-body no-indent">1987 维护记录将 R-0 标为“旧堂”；1964 资料称其为“魖堂”。</p><p class="no-indent">本地记录：<a href="#archive/lastday" data-route>2020-03-17 ZHL-ARCHIVE-01 访问日志</a></p></section>`); }
function lastDayPage(){ unlock('lastday'); return article('ZHL-ARCHIVE-01 本地访问记录','2020-03-17',`<div class="doc">16:46:02　OPEN　xu_hall_access_log\n16:46:49　OPEN　offering_register\n16:47:13　COPY　offering_register\n16:47:42　UPLOAD ATTEMPT　FAILED\n16:48:00　NETWORK：DISCONNECTED（MANUAL）\n\n16:49　外发消息：他们来了\n16:49　外发消息：不是老师\n16:50:11　LWX-ADMIN　ENTRY\n16:50:29　SQM-MASTER　ENTRY\n16:51:02　ZJC-BOARD　ENTRY\n16:52　草稿：门锁了。\n16:52　草稿：他们知道我找到这里。\n16:54　语音转写：\n男性：把手机给我。\n女性：你们到底想干什么？\n男性：你不该查这些。\n16:56　草稿：他们说我已经定了。名单已经改完。\n16:59　DOOR R-0　OPEN　AUTH：ZJC-BOARD\n17:00　DOOR R-0　CLOSED</div><p>环境传感器：TEMP 16.2°C / HUMIDITY 81% / LIGHT OFF。</p>`); }
function voicePage(){ unlock('voice'); return article('R-0 内部声音记录','2020-03-17',`<div class="doc">设备：R0-VOICE-01\n设备状态：DISCONNECTED SINCE 2018\n网络能力：仅本地存储\n\n17:04　VOICE DETECTED　“开门”\n17:05　VOICE DETECTED　“沈校长”\n17:11　记录中断\n\n23:41:09　VOICE DETECTED　内容：无法识别\n00:02:17　VOICE DETECTED　内容：<b>“有。”</b>\n\nSPEAKER：UNKNOWN\n声纹比对：HX2020-03219 / 沈启铭 / 陆文修 / 周敬川　MATCH：0%</div><p>旧礼残抄中有句：“井下有人应，则不可再问。”</p>`); }

function devicePage(){ unlock('device'); return article('2018年R-0设备退役记录','2018-06-11',`<div class="doc">设备编号：R0-VOICE-01\n用途：环境声音检测\n状态：退役\n断电日期：2018-06-11\n网络：无\n存储：本地\n电源：已拆除\n维护人：总务处</div><p>2019年资产盘点仍显示：未使用、无供电、无联网、保留原位。</p>`); }
function anomaly2020(){ unlock('cold'); return article('2020-03-18设备异常条目','2020-03-18',`<div class="doc">设备：R0-VOICE-01\n异常：产生本地记录\n供电：无\n网络：无\n记录状态：保留\n处理意见：不维修 / 不迁移 / 不得删除原存储\n\nR0-TEMP-01（2017年停用）\n17:00　16.2℃\n19:00　15.8℃\n21:00　14.9℃\n23:00　13.1℃\n00:00　11.7℃\n00:17　8.4℃\n00:23　16.0℃</div><p>同一时段 B1 外部温度约 17℃。旧礼残文称：“魖食之时，堂中先寒。”</p>`); }
function wellDepth(){ unlock('return'); return article('1983年方井测深记录','1983-08-12',`<div class="doc">维修人员私自以绳测井。\n\n第一次：绳长 30 米，未到底。\n第二次：绳长 50 米，未到底。\n第三次：停止。\n\n《综合楼地基勘察摘要》：B1 地面至基础底部最大深度不足 8 米；未发现深井结构或大型天然洞穴。</div><p>2004 值班本记“夜深，地下寒甚”；1987 总务笔记记“堂内结露”。</p><p class="no-indent">关联档案：<a href="#archive/return" data-route>奉生后异常记录汇总</a></p>`); }
function returnPage(){ unlock('current'); return article('奉生后异常记录汇总','历史档案',`<div class="doc">1987　凌晨来电，无号：“请叫陈惠兰接电话。”\n1994　夜半电话铃三次，第三次有女声问：“这是学校吗？”\n2004　校内 BBS 空白帖：下面有人。\n2012　HX12-0241　LOGIN SUCCESS；QUERY：门 / 不开 / 下面\n2020　HX2020-03219　AUTH：BYPASS；QUERY：出去\n\n旧礼残页：\n“食毕，名未必尽。有返声者，有返字者，有返影者。皆不可应。”</div><p>2020年3月18日 03:44，旧摄像系统依次记录 B1→1F→2F→3F 的 PERSON MOTION；门禁没有任何离开记录。</p><p class="no-indent"><a href="#archive/current-voice" data-route>查看当前 R0-VOICE-01 状态</a></p>`); }
function currentVoice(){ unlock('burst4'); const after=state.flags.burst4?'<div class="notice">旧设备的历史索引被重新唤醒：<b>HX2020-03219 / 2021</b>。</div>':''; return layout(`<div class="crumb">当前位置：首页 &gt; 当前系统日志</div><section class="card article"><h1>R0-VOICE-01 当前记录</h1><div class="article-meta">设备状态：无电 / 无网络 / 自2018年停用</div><div class="system-panel">2026-08-25 ${new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}\nVOICE DETECTED\n内容：<b>“叶紫贤。”</b>\n声源：UNKNOWN\n\n数秒后\nVOICE DETECTED\n内容：<b>“到。”</b></div><p class="article-body no-indent">这不是2020年旧数据。记录时间就是当前。</p>${after}${state.flags.burst4?'':'<button class="system-action danger" data-action="burst4">查看完整日志</button>'}</section>`); }
function anniversaryPage(){ unlock('anniversary'); return article('夜间门禁异常记录','2021-03-17',`<div class="doc">00:18　门禁：HX2020-03219　ACCESS GRANTED\n00:19　位置：综合楼B1\n00:19　AUTH：BYPASS\n管理员进入记录：无\n\n卡片库存记录：HX2020-03219 已于2020-03-18登记为 R-0 余物，封存于旧档案柜。</div><p>后续年份留下相似痕迹：2022年检索“周年返”；2023年图书馆闭馆后账号搜索“门”；2024年旧BBS出现“我不是转学”；2025年后台短暂显示“状态：归”。</p><p class="no-indent"><a href="#archive/sessions" data-route>查看 2026 当前访问日志</a></p>`); }
function sessionsPage(){ unlock('sessions'); const after=state.flags.burst5?'<div class="notice">所有异常停止。当前后台新增：<a href="#archive/old-status" data-route>《2026旧例状态》</a>。</div>':''; return layout(`<div class="crumb">当前位置：首页 &gt; 当前系统日志</div><section class="card article"><h1>当前访问日志</h1><div class="article-meta">旧学籍系统</div><div class="system-panel">LEGACY RECORD REBUILDING\n\n当前在线：<b>3</b>\nSESSION：ANONYMOUS（你）　LOCATION：archive\nSESSION：HX2020-03219　LOCATION：/student/HX2026-04127\nSESSION：—　LOCATION：R-0\n\n管理员操作：\nDISABLE HX2020-03219　失败\nDELETE HX2020-03219　失败\nARCHIVE HX2020-03219　失败\nERROR：<b>OWNER LOCKED</b>\n\nSYSTEM NOTICE：有人吗\nSYSTEM NOTICE：别让她进去</div><p class="article-body no-indent">无ID session 不访问网页；它正在查看叶紫贤的名字。</p>${after}${state.flags.burst5?'':'<button class="system-action danger" data-action="burst5">查看实时会话详情</button>'}</section>`); }
function oldStatus(){ unlock('stage6'); return layout(`<div class="crumb">当前位置：首页 &gt; 当前后台 &gt; 旧例状态</div><section class="card article"><h1>2026旧例状态</h1><div class="article-meta">内部页面缓存</div><div class="system-panel">旧例：<b>启</b>\n魖示：<b>已至</b>\n本期奉生：待定\n\n学生事项：待示名\n当前财务：项目审批存在不确定性\n董事会特别事项：旧例是否启用，已无再议必要。</div><p class="article-body no-indent">周敬川负责，韩启山、周若恒参与审批。</p></section>`); }
function selectedPage(){ unlock('lin'); return article('示名扫描记录','2026-08-25',`<div class="system-panel">示名扫描：进行中\n候选池：在籍学生 2841\n\n2026-08-23　无\n2026-08-24　无\n2026-08-25　FOUND\n对象：████████\n\n2026-08-25 02:14　学生记录 HIDE\n对象学号：<b>HX2026-04127</b>\n姓名：NULL</div><p>同日，初二（1）班页面显示应有40人，名单中只有39人。</p>`); }
function linPage(){ unlock('lin-detail'); return article('2026年夏季田径测试成绩汇总','2026-06-18',`<div class="doc">女子400米\nHX2026-04127　<b>林知遥</b>　初二（1）班　1分11秒48\n\n2026-08-25 02:14　获奖页修订\n2026-08-25 02:21　班级名单修订\n2026-08-25 02:33　学生档案冻结\n2026-08-25 03:01　搜索索引重建</div><div class="notice">她今天仍正常刷卡（08:01）、在第二食堂消费（12:03）、于图书馆借阅（13:27）。网站已经开始忘记她，她却还不知道。</div><p class="no-indent"><a href="#archive/lin-plan" data-route>查看学生事务特殊安排</a></p>`); }
function linPlan(){ unlock('plan'); return layout(`<div class="crumb">当前位置：首页 &gt; 当前内部计划</div><section class="card article"><h1>学生事务特殊安排</h1><div class="article-meta">2026-08-27</div><div class="system-panel">15:40　正常放学\n16:10　通知目标前往综合楼\n　　　　理由：学生档案核对\n16:30　进入 B1\n17:00　R-0\n\n奉生：<b>已定</b>\n对象：HX2026-04127 / 林知遥\n除名：进行中</div><p class="article-body no-indent">同一流程与2020年几乎完全一致。</p><button class="system-action" data-action="message-lin">通过学生咨询系统提交提醒</button><div id="messageOutcome"></div></section>`); }
function safetyPage(){ unlock('safety'); const done=state.flags.safety?'<div class="notice">R-0 门禁：<b>维修锁定</b>。奉生计划出现 ERROR；周敬川尝试 OVERRIDE，失败。<br>当前学生统计：2841 → 2843。<a href="#archive/xu-student" data-route>查看额外在籍记录</a></div>':''; return layout(`<div class="crumb">当前位置：首页 &gt; R-0维护控制</div><section class="card article"><h1>R-0 安全维护模式</h1><div class="article-meta">虚构设备维护界面</div><div class="system-panel">R-0 门禁需三人授权。\n供电来源：B1 配电柜。\n维护模式：R0 SAFETY LOCK\n状态：${state.flags.safety?'维修锁定':'可启用'}\n\n启用后：R-0 门禁进入维修锁定。\n说明：本页仅模拟游戏内虚构系统，不涉及真实设备。</div>${state.flags.safety?'':'<button class="system-action" data-action="safety">启用 SAFETY LOCK</button>'}${done}<div id="safetyOutcome"></div></section>`); }
function requestPage(){ unlock('request'); const done=state.flags.withdrawn?'<div class="notice">所求：无　　奉生：无效　　对象：解除<br>林知遥：<span class="status-safe">SELECTED → ACTIVE</span><br>旧礼残句：所求既撤，已至之魖不可空归。<br><a href="#archive/final-choice" data-route>查看叶紫贤当前档案</a></div>':''; return layout(`<div class="crumb">当前位置：首页 &gt; 当前内部文件</div><section class="card article"><h1>所求书</h1><div class="article-meta">2026 旧例关联文件</div><div class="system-panel">求：${state.flags.withdrawn?'无':'好贤教育集团项目获准'}\n求：${state.flags.withdrawn?'—':'周氏持有权益得保'}\n求：${state.flags.withdrawn?'—':'校产增'}\n\n确认：周敬川\n状态：${state.flags.withdrawn?'已撤销':'有效'}\n\n旧礼：无求，则不得奉。</div><p class="article-body no-indent">系统保留“撤求”功能：供养者可在奉生完成前反悔。</p>${state.flags.withdrawn?'':'<button class="system-action danger" data-action="withdraw">撤销 2026 所求</button>'}${done}<div id="withdrawOutcome"></div></section>`); }
function finalChoice(){ unlock('choice'); return layout(`<div class="crumb">当前位置：首页 &gt; 当前学生档案</div><section class="card article"><h1>HX2020-03219</h1><div class="article-meta">关联记录重建中</div><div class="system-panel">叶紫贤 session：在线 / 离线 / 在线\nSYSTEM NOTICE：<b>“快”</b>\nSYSTEM NOTICE：<b>“把我删掉”</b>\n\n无ID session：在线\n访问：HX2020-03219</div><p class="article-body no-indent">删除会切断当前恢复的关联索引，但不会真正删除游戏中的历史原始文件。</p><button class="system-action" data-action="ending-keep">保留叶紫贤的名字</button> <button class="system-action danger" data-action="ending-remove">删除当前关联索引</button><div id="endingOutcome"></div></section>`); }
function xuStudent(){ unlock('xuvisual'); return layout(`<div class="crumb">当前位置：首页 &gt; 当前学生系统 &gt; 档案详情</div><section class="card article"><h1>学生档案</h1><div class="article-meta">查询结果</div><img class="xu-image" src="./assets/xu-hall.png" alt="昏暗魖堂中，方井、黑桌与面部悬着魖字的人形" /><p class="image-caption">档案预览图：来源字段缺失</p><div class="system-panel">姓名：<b>魖</b>\n学号：—\n入学时间：—\n毕业时间：—\n班级：—\n状态：<b>在籍</b>\n最后访问：刚刚</div><p class="article-body no-indent">刷新后，这个档案将不再存在。</p>${state.flags.burst6?'':'<button class="system-action danger" data-action="burst6">查看访问详情</button>'}</section>`); }
function triggerAnomaly(kind){
  const layer=$('#anomalyLayer'); if(!layer) return; const strong=kind==='six'; const texts=strong?['奉一','还差一个','在册','不要叫名字','魖示：已至','归','叶紫贤不是名字','魖']:(kind==='five'?['不要回答','它已经来了','在线','归','叶紫贤','别让她进去']:['不要找她','不要叫她','不要让她回来','她已经归了']);
  const pops=(strong?18:9); layer.innerHTML=`<div class="anomaly-text">${Array(18).fill(texts.join('　')).join('<br>')}</div>${Array.from({length:pops},(_,i)=>`<div class="anomaly-pop" style="left:${(i*17)%78+4}%;top:${(i*29)%72+6}%"><b>${texts[i%texts.length]}</b>${i%2?'检测到旧学籍访问':'请停止查询'}</div>`).join('')}<div class="anomaly-face"></div>`;
  document.body.classList.add('site-corrupt'); layer.classList.add('anomaly-active'); setTimeout(()=>{layer.classList.remove('anomaly-active');layer.innerHTML='';document.body.classList.remove('site-corrupt');}, state.flags.reduceMotion?2600:(strong?4200:3200));
}
function action(name){
  if(name==='burst4' && !state.flags.burst4){ flag('burst4'); triggerAnomaly('four'); setTimeout(()=>render(),state.flags.reduceMotion?2700:3300); }
  if(name==='burst5' && !state.flags.burst5){ flag('burst5'); triggerAnomaly('five'); setTimeout(()=>render(),state.flags.reduceMotion?2700:3300); }
  if(name==='burst6' && !state.flags.burst6){ flag('burst6'); triggerAnomaly('six'); setTimeout(()=>go('archive/request'),state.flags.reduceMotion?2800:4300); }
  if(name==='message-lin'){ flag('message'); $('#messageOutcome').innerHTML='<div class="notice">留言审核中……　已删除。后台关键词拦截：综合楼。<br><span class="online">HX2020-03219 搜索：门 → 电 → R0</span></div>'; }
  if(name==='safety' && !state.flags.safety){ flag('safety'); render(); }
  if(name==='withdraw' && !state.flags.withdrawn){ flag('withdrawn'); render(); }
  if(name==='ending-keep'){ flag('ending','keep'); $('#endingOutcome').innerHTML='<div class="notice">林知遥已脱离奉生。叶紫贤记录保持 ACTIVE。<br>OWNER：<b>魖</b><br>当前在线：2（你 / 无ID）。网站恢复正常。</div>'; }
  if(name==='ending-remove'){ flag('ending','remove'); $('#endingOutcome').innerHTML='<div class="notice">关联记录：43 → 31 → 18 → 7 → 1 → 0<br>SYSTEM NOTICE：<b>“谢谢。”</b><br>叶紫贤 session 已退出。魖示：弱 → 无。林知遥保住了。</div>'; }
}

const result = (title, date, summary, target) => `<article class="result-item"><h2><a href="#${target}" data-route>${title}</a></h2><div class="meta">发布时间：${date}</div><p>${summary}</p></article>`;
function searchPage(raw) {
  const q = decodeURIComponent(raw || '').trim(); const has = id => state.clues.has(id);
  let items=[];
  if (/叶紫贤/.test(q)) {
    items = [
      result('我校学生在2019年沪市青少年艺术展演中取得佳绩','2019-05-24','……初二（2）班<em class="keyword">叶紫贤</em>、初二（4）班周若宁等同学在本届艺术展演中表现突出……','article/art'),
      result('2019学年度第一学期优秀学生表彰名单','2020-01-07','……初三（2）班<em class="keyword">叶紫贤</em>、陈子墨、王雨桐等同学获得“学习进步之星”……','article/awards'),
      result('2020届初三年级毕业生信息确认通知','2020-06-18','……请<em class="keyword">叶紫贤</em>、王雨桐、陈子墨等同学核对个人毕业信息……','article/graduate'),
      result('关于部分历史页面调整的说明','2020-07-02','……近期学校网站进行历史数据整理，部分涉及<em class="keyword">叶紫贤</em>等已离校学生的信息将不再展示……','article/deleted')
    ];
    if(has('access')) items.push(result('2020年3月17日初三年级异常情况登记','—','……初三（2）班一名学生放学后未按规定离校，班主任已联系家长……','archive/A-20200317-07'));
  } else if (/HX2020-03219/.test(q) && !/(EXIT|离校|2021)/.test(q)) {
    if(has('code') || has('identity')) items=[result('2019年秋季运动会成绩汇总','2019-10-18','……<em class="keyword">HX2020-03219 叶紫贤</em>，女子800米第二名……','article/sport'),result('图书馆旧账号迁移异常记录','2020-03-21','……<em class="keyword">HX2020-03219</em>：原学生记录不存在，历史借阅记录保留……','student/HX2020-03219')];
  } else if (/转学|学籍/.test(q)) {
    if(has('identity')) items=[result('2020年春季学籍变动情况汇总','2020-03-18','……<em class="keyword">HX2020-03219</em>　转出……','article/transfer'),result('2020届学生学籍备注','2020-06-22','……叶紫贤，学籍状态：转出，原因：家庭原因……','article/transfer')];
  } else if (/2020.?03.?17|3月17/.test(q)) {
    if(has('transfer')) items=[result('校园门禁历史数据','历史系统导出','……2020-03-17 08:03:14　CARD：<em class="keyword">HX2020-03219</em>　ENTRY……','article/day'),result('初三年级晚自习异常情况登记','2020-03-17','……初三（2）班应到42，实到41，请假0……','article/day')];
  } else if (/学生异常离校/.test(q)) {
    if(has('entry')) items=[result('关于进一步加强学生离校登记管理的通知','2018-09-03','……住宿学生如因特殊情况提前离校，须完成班主任、年级组及门卫登记……','article/开学'),result('2016年校园安全工作会议纪要','2016-10-14','……进一步规范学生异常离校、请假和家长接送登记制度……','article/practice'),result('初中部学生考勤系统升级说明','2013-02-18','……针对迟到、早退、请假及异常离校情况进行统一记录……','article/library'),result('2012年11月学生事务情况汇总','2012-11-09','……一名学生出现连续缺勤及异常离校情况，相关学籍手续已完成……','archive/2012-summary')];
  } else if (/唐珞|HX12-0241/.test(q)) {
    if(has('tang-name')) items=[result('2011学年校园广播站成员名单','2011-09-12','……初一（4）班<em class="keyword">唐珞</em>、许曼、赵启辰……','archive/tang'),result('我校学生参加2012年市青少年作文比赛','2012-05-22','……<em class="keyword">唐珞</em>同学作品《旧操场》获初中组优秀奖……','archive/tang'),result('2012年11月学籍变动汇总','2012-11-09','……<em class="keyword">唐珞</em>，初二（4）班，转出……','archive/2012-change-old')];
  } else if (/家庭搬迁|郑岚/.test(q)) {
    if(has('tang-day')) items=[result('2004学年学生异动情况备案','2004-04-16','……初二（3）班<em class="keyword">郑岚</em>因家庭原因办理离校手续……','archive/zheng'),result('2012年11月学生事务情况汇总','2012-11-09','……唐珞，原因：家庭搬迁，接收学校：—……','archive/tang')];
  } else if (/综合楼/.test(q)) {
    if(has('tang-day')) items=[result('关于综合楼临时检修的通知','2012-11-06','……因综合楼部分线路出现异常，为保障师生安全，部分区域暂时停止使用……','archive/tang'),result('2004学年学生异动情况备案','2004-04-16','……郑岚最后一条校园卡记录位于综合楼；次日学校发布消防设施维修通知……','archive/zheng')];
  } else if (/学生离校|历届转学生|转出.*接收|接收.*转出/.test(q)) {
    if(has('pattern')) items=[result('1994年度学生学籍异动登记','1994-09-23','……许明川，初二甲班，离校，去向未记……','archive/xu'),result('1987年秋季学生变动登记','1987-10-12','……陈惠兰，初二乙班，因家事离校，手续缺……','archive/chen')];
  } else if (/许明川/.test(q)) {
    if(has('pattern')) items=[result('1994年度学生学籍异动登记','1994-09-23','……<em class="keyword">许明川</em>，初二甲班，离校，去向未记……','archive/xu'),result('好贤校讯 1994年第3期','1994-06-15','……初二甲班许明川同学在市中学生数学竞赛中获得三等奖……','archive/xu')];
  } else if (/陈惠兰/.test(q)) {
    if(has('pattern')) items=[result('1987年秋季学生变动登记','1987-10-12','……<em class="keyword">陈惠兰</em>，初二乙班，因家事离校……','archive/chen')];
  } else if (/校史大事记|失踪 获利|学校发展/.test(q)) {
    if(has('pattern')) items=[result('好贤学校大事记（历史资料摘录）','校史数字馆','……学校多次经历办学调整，但每逢关键时期，总能化险为夷、重新发展……','archive/timeline')];
  } else if (/^B1$|综合楼 B1|ZHL-ARCHIVE-01/.test(q)) {
    if(has('pattern') || has('benefit')) items=[result('综合楼旧服务器设备维护记录','2016-06-14','……ZHL-ARCHIVE-01，位置：综合楼旧档案区，备注：B1网络条件较差……','archive/b1')];
  } else if (/好贤义塾|校董旧账|旧例|历史办法|财势/.test(q)) {
    if(has('pattern')) items=[result('好贤义塾旧档案整理说明','2008-10-16','……部分账册、学生名簿及校董会议记录存在缺页或字迹不清情况……','archive/ledger-yi'),result('好贤百年：从义塾到现代学校','2008-10-16','……百余年来，学校多次经历危机，却总能化险为夷、重新发展……','archive/timeline')];
  } else if (/^奉$/.test(q)) {
    if(has('pattern')) items=[result('1931年杂项账册','民国二十年','……秋后银元若干，修西屋。另奉一……','archive/ledger-yi')];
  } else if (/奉一/.test(q)) {
    if(has('yi')) items=[result('1987年度校务杂记数字化摘录','1987','……十月十二，<em class="keyword">奉一</em>。十一月，扩建事项有进展……','archive/ledger'),result('民国十九年校董杂录','民国十九年','……财势渐败，宜照旧例，奉生一……','archive/minguo')];
  } else if (/奉\s*生/.test(q) && !/之后/.test(q)) {
    if(has('ledger') || has('b1')) items=[result('旧例杂录·残','约民国初年','……行则择册中者……<em class="keyword">奉生</em>……除其名……财势复……','archive/fusheng'),result('民国十九年校董杂录','民国十九年','……财势败，议<em class="keyword">奉生</em>一……','archive/minguo')];
  } else if (/鬼部.*生僻字|生僻字.*鬼部/.test(q)) {
    if(has('unknown')) items=[result('民国校董档案异体字校对表','校史资料室','……部首：鬼，右部：虚，统一录作“魖”……','archive/character-table')];
  } else if (/魖\s*食|魖食/.test(q)) {
    if(has('xu')) items=[result('旧礼释词残页','年代不详','……魖不食五谷，不食牲，不食香火。所食者，人也……','archive/xu-eat')];
  } else if (/养魖/.test(q)) {
    if(has('xu')) items=[result('旧例杂录·卷二','民国初年','……养魖有三戒：不可妄奉，不可绝食，不可使外人知……','archive/xu-raise')];
  } else if (/册中择一/.test(q)) {
    if(has('raise')) items=[result('旧例杂录·名册篇','民国初年','……必取册中之名。既定，则先除其名……','archive/xu-roster')];
  } else if (/除名|生名/.test(q)) {
    if(has('roster')) items=[result('学生档案处理旧规','1986','……对特殊离校学生，应统一处理班级名册、获奖记录、图书馆记录；须尽量避免残名……','archive/removal'),result('旧礼释词残页','年代不详','……在册、在籍、有名、有归属者，谓之“生”……','archive/xu-eat')];
  } else if (/已定|求财|求地|求势|新校区/.test(q)) {
    if(has('eat') || has('remove')) items=[result('2020年第一季度内部事项摘要','2020-02-21','……旧例：启；所求：新校区；奉生：<em class="keyword">已定</em>；对象：03219……','archive/offering')];
  } else if (/魖堂/.test(q)) {
    if(has('xu')) items=[result('1964年校舍修缮附记','1964','……综合楼旧址施工，不得动<em class="keyword">魖堂</em>及井……','archive/xu-hall')];
  } else if (/方井.*测深|测深.*方井/.test(q)) {
    if(has('cold')) items=[result('1983年方井测深记录','1983-08-12','……绳长50米，未到底。B1地面至基础底部最大深度不足8米……','archive/well-depth')];
  } else if (/奉生之后|返声|返字|返影|^返$/.test(q)) {
    if(has('return')) items=[result('奉生后异常记录汇总','历史档案','……有返声者，有返字者，有返影者。皆不可应……','archive/return')];
  } else if (/魖\s*寒|堂中先寒/.test(q)) {
    if(has('cold')) items=[result('旧礼寒温残文','民国旧礼','……魖食之时，堂中先寒。夏亦如冬……','archive/well-depth')];
  } else if (/方井|旧井/.test(q)) {
    if(has('hall')) items=[result('方井旧俗记录','民国旧礼','……魖堂无像。堂中一牌，一桌，一井。井方。不得照……','archive/xu-well')];
  } else if (/R0\s*(SAFETY|安全)|安全维护|维修锁/.test(q)) {
    if(has('plan')) items=[result('R-0 安全维护模式','当前维护系统','……维护模式：R0 SAFETY LOCK；门禁进入维修锁定……','archive/safety')];
  } else if (/R-0/.test(q)) {
    if(has('b1') || has('hall')) items=[result('综合楼B1旧平面说明','旧服务器本地资料','……设备间北墙后部：<em class="keyword">R-0</em>，责任部门：校董会办公室……','archive/r0')];
  } else if (/offering_register|他们来了|16:49/.test(q)) {
    if(has('offering') && has('r0')) items=[result('ZHL-ARCHIVE-01 本地访问记录','2020-03-17','……16:49 外发消息：他们来了；16:50 三个管理员账户进入B1……','archive/lastday')];
  } else if (/R0-VOICE-01 2020/.test(q)) {
    if(has('device')) items=[result('2020-03-18设备异常条目','2020-03-18','……供电：无；网络：无；产生本地记录；不得删除原存储……','archive/device-2020')];
  } else if (/R0-VOICE|声音记录|井下有人应/.test(q)) {
    if(has('voice')) items=[result('2018年R-0设备退役记录','2018-06-11','……R0-VOICE-01，断电、无网络、电源已拆除……','archive/device')];
    else if(has('lastday')) items=[result('R-0 内部声音记录','2020-03-17','……00:02:17 VOICE DETECTED，内容：“有。”……','archive/voice')];
  } else if (/HX2020-03219.*2021/.test(q)) {
    if(has('burst4')) items=[result('夜间门禁异常记录','2021-03-17','……HX2020-03219，00:18 ACCESS GRANTED；管理员进入记录：无……','archive/anniversary')];
  } else if (/2026旧例|旧例状态/.test(q)) {
    if(has('anniversary')) items=[result('2026旧例状态','当前后台缓存','……魖示：已至；本期奉生：待定；学生事项：待示名……','archive/old-status')];
  } else if (/示名/.test(q)) {
    if(has('stage6')) items=[result('示名扫描记录','2026-08-25','……FOUND；对象学号：HX2026-04127；姓名：NULL……','archive/selected')];
  } else if (/魖示/.test(q)) {
    if(has('stage6')) items=[result('2026旧例状态','当前后台缓存','……魖示：已至；本期奉生：待定……','archive/old-status')];
  } else if (/HX2026-04127|林知遥/.test(q)) {
    if(has('lin')) items=[result('2026年夏季田径测试成绩汇总','2026-06-18','……HX2026-04127，<em class="keyword">林知遥</em>，初二（1）班，女子400米……','archive/lin')];
  } else if (/R0 SAFETY|安全维护|安全锁/.test(q)) {
    if(has('plan')) items=[result('R-0 安全维护模式','当前维护系统','……维护模式：R0 SAFETY LOCK；可启用……','archive/safety')];
  } else if (/所求书|2026所求/.test(q)) {
    if(has('safety')) items=[result('所求书','2026旧例关联文件','……求：项目获准 / 权益得保 / 校产增；旧礼：无求，则不得奉……','archive/request')];
  } else if (/魖.*在籍|在籍.*魖/.test(q)) {
    if(has('lin-detail')) items=[result('当前学生档案','当前学生系统','……姓名：魖；状态：在籍；最后访问：刚刚……','archive/xu-student')];
  } else if (/魖/.test(q)) {
    if(has('xu')) items=[result('贤塘旧俗摘录','清末抄本','……乡人谓之<em class="keyword">魖</em>，不祀而养……','archive/xu-folklore'),result('好贤义塾杂记','1911','……塾成之后，旧魖之事仍依周氏所定……','archive/xu-raise'),result('校董杂录','1930','……奉生一，奉于魖……','archive/minguo'),result('1964年校舍修缮附记','1964','……魖堂不得动……','archive/xu-hall')];
  } else if (/EXIT|离校/.test(q)) {
    if(has('day')) items=[result('旧门禁综合查询','历史查询','……学生编号 HX2020-03219，离校记录：<em class="keyword">NULL</em>……','article/exit')];
  } else if (/1843/.test(q)) {
    items=[result('关于3月18日初中部教学安排调整的通知','2020-03-18','……因综合楼设备维护及校园设施临时检查，今日部分课程调整……','article/deleted')];
  }
  const content = items.length ? items.join('') : `<div class="empty">没有找到与“${q || '—'}”相关的内容。<br><small>请检查关键词，或继续浏览网站资料。</small></div>`;
  return layout(`<div class="crumb">当前位置：首页 &gt; 站内搜索</div><section class="card"><h1 class="section-title">站内搜索</h1><div class="result-head">关键词：<b>${q || '—'}</b><span style="float:right">共找到 <b>${items.length}</b> 条相关内容</span></div>${content}</section>`);
}
function studentArchive(){ read('student'); return layout(`<div class="crumb">当前位置：首页 &gt; 学生档案 &gt; 历史接口</div><section class="card article"><h1>学生档案查询结果</h1><div class="article-meta">/student/archive?id=HX2020-03219</div><div class="doc">student_id: HX2020-03219\nname: <span class="redacted">NULL</span>\nclass: 2020-03-02\nstatus: transferred\nlast_update: 2020-03-20 03:57:41</div><p class="article-body no-indent">记录状态为“转学”，但姓名字段已经被清空。</p></section>`); }
function graduate(){ return article('2020届初三年级毕业生信息确认通知','2020-06-18','<p>各位初三年级学生及家长：</p><p>为做好2020届毕业生学籍信息整理工作，请各班学生于6月22日前完成个人信息核对。</p><p>如发现姓名、身份证件号码、联系方式等信息存在错误，请及时向班主任反馈。已办理转学、休学等手续的学生无需参与本次信息确认。</p>','附件：2020届毕业生信息确认名单.pdf'); }
function render(){
  const path=(location.hash || '#home').slice(1); let html;
  if(path==='reset'){ localStorage.removeItem('haoxian-progress'); location.hash='home'; location.reload(); return; }
  if(!canOpen(path)) html=unavailablePage();
  else if(path==='home') html=home();
  else if(path==='students/class2020') html=classPage();
  else if(path==='downloads') html=downloads();
  else if(path==='document/accounts') html=documentPage('accounts');
  else if(path==='article/awards') html=awards();
  else if(path==='article/awards-old') html=awards(true);
  else if(path==='article/sport') html=sport();
  else if(path==='article/transfer') html=transfer();
  else if(path==='article/day') html=dayPage();
  else if(path==='article/exit') html=exitPage();
  else if(path==='article/deleted') html=deleted();
  else if(path==='article/graduate') html=graduate();
  else if(path==='student/HX2020-03219') html=studentArchive();
  else if(path==='archive/A-20200317-07') html=finalEntry();
  else if(path==='archive/2012-summary') html=archive2012();
  else if(path==='archive/2012-change') html=change2012();
  else if(path==='archive/2012-change-old') html=change2012old();
  else if(path==='archive/tang') html=tangPage();
  else if(path==='archive/zheng') html=zhengPage();
  else if(path==='oldsite/2004') html=oldsite();
  else if(path==='archive/zheng-version') html=zhengVersion();
  else if(path==='archive/xu') html=earlierPage('xu');
  else if(path==='archive/chen') html=earlierPage('chen');
  else if(path==='archive/timeline') html=timelinePage();
  else if(path==='archive/ledger-yi') html=oldLedger('yi');
  else if(path==='archive/ledger') html=oldLedger('ledger');
  else if(path==='archive/minguo') html=oldLedger('minguo');
  else if(path==='archive/b1') html=b1Page();
  else if(path==='archive/old-ritual') html=unknownFile();
  else if(path==='archive/fusheng') html=fushengPage();
  else if(path==='archive/character-proof') html=characterProof();
  else if(path==='archive/character-table') html=characterTable();
  else if(path==='archive/xu-folklore') html=xuPage('folklore');
  else if(path==='archive/xu-raise') html=xuPage('raise');
  else if(path==='archive/xu-roster') html=xuPage('roster');
  else if(path==='archive/xu-eat') html=xuPage('eat');
  else if(path==='archive/xu-hall') html=xuPage('hall');
  else if(path==='archive/xu-well') html=xuPage('well');
  else if(path==='archive/removal') html=removalPage();
  else if(path==='archive/offering') html=offeringPage();
  else if(path==='archive/r0') html=r0Page();
  else if(path==='archive/lastday') html=lastDayPage();
  else if(path==='archive/voice') html=voicePage();
  else if(path==='archive/device') html=devicePage();
  else if(path==='archive/device-2020') html=anomaly2020();
  else if(path==='archive/well-depth') html=wellDepth();
  else if(path==='archive/return') html=returnPage();
  else if(path==='archive/current-voice') html=currentVoice();
  else if(path==='archive/anniversary') html=anniversaryPage();
  else if(path==='archive/sessions') html=sessionsPage();
  else if(path==='archive/old-status') html=oldStatus();
  else if(path==='archive/selected') html=selectedPage();
  else if(path==='archive/lin') html=linPage();
  else if(path==='archive/lin-plan') html=linPlan();
  else if(path==='archive/safety') html=safetyPage();
  else if(path==='archive/request') html=requestPage();
  else if(path==='archive/xu-student') html=xuStudent();
  else if(path==='archive/final-choice') html=finalChoice();
  else if(path.startsWith('search/')) html=searchPage(path.slice(7));
  else if(path.startsWith('article/')) html=genericArticle(path.slice(8));
  else if(['about','news','teaching','faculty','admission','disclosure','history','contact','sitemap'].includes(path)) {
    const copy={about:'<p>沪市好贤学校创办于1908年，前身为好贤义塾。学校现设小学部、初中部和高中部，拥有现代化教学设施。</p><p>近年来，学校教育教学质量稳步提升，先后获得沪市文明校园、沪市特色教育示范学校等荣誉。</p>',news:'<p>学校新闻按发布时间归档。请通过首页查看最新校园动态。</p>',teaching:'<p>学校坚持五育并举，开齐开足国家课程，持续推进课堂教学改革。</p>',faculty:'<p>学校现有专任教师186人，其中高级教师42人，市、区级骨干教师35人。</p>',admission:'<p>有关招生计划、课程设置及校园开放安排，请以学校招生办公室发布的信息为准。</p>',disclosure:'<p>本栏目依法公开学校基本信息、收费项目、招生事项和校务工作。</p>',history:'<p>好贤学校前身为好贤义塾。校史资料正在持续数字化整理中。</p>',contact:'<p>地址：沪市静安区文河路218号。电话：021-6588 2048。</p>',sitemap:'<p>学校首页　学校概况　新闻中心　教育教学　师资队伍　学生天地　招生信息　校务公开　校史馆　资料下载</p>'}; const titles={about:'学校概况',news:'新闻中心',teaching:'教育教学',faculty:'师资队伍',admission:'招生信息',disclosure:'校务公开',history:'校史馆',contact:'联系我们',sitemap:'网站地图'}; html=simplePage(titles[path],copy[path]);
  } else html=layout(`<div class="crumb">当前位置：首页 &gt; 页面不存在</div><section class="card locked"><b>您访问的内容不存在。</b><p>该页面可能已被删除、移动或暂时不可访问。</p></section>`);
  app.innerHTML=html; bindPage(); document.querySelectorAll('.main-nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href') === '#'+path)); window.scrollTo({top:0,behavior:'instant'});
}
function submitSearch(value){ const q=value.trim(); if(q){ dialog.close(); go('search/'+encodeURIComponent(q)); } }
function bindPage(){
  $('#inlineSubmit')?.addEventListener('click',()=>submitSearch($('#inlineSearch').value));
  $('#inlineSearch')?.addEventListener('keydown',e=>{if(e.key==='Enter') submitSearch(e.currentTarget.value)});
  document.querySelectorAll('[data-search]').forEach(el=>el.addEventListener('click',()=>{ input.value=el.dataset.search; dialog.showModal(); input.focus(); }));
  document.querySelectorAll('button[data-route]').forEach(el=>el.addEventListener('click',()=>go(el.dataset.route.replace(/^#/,''))));
  document.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>action(el.dataset.action)));
}
$('#searchTrigger').addEventListener('click',()=>{ dialog.showModal(); input.focus(); });
$('#searchSubmit').addEventListener('click',e=>{ e.preventDefault(); submitSearch(input.value); });
input.addEventListener('input',()=>{ const q=input.value.trim(); $('#suggestions').innerHTML = q ? `<p>按 Enter 或点击“搜索”检索“<b>${q}</b>”</p>` : ''; });
input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submitSearch(input.value)}});
$('#reduceMotion').checked=!!state.flags.reduceMotion;
$('#reduceMotion').addEventListener('change',e=>{flag('reduceMotion',e.currentTarget.checked);document.body.classList.toggle('reduce-motion',e.currentTarget.checked);});
document.body.classList.toggle('reduce-motion',!!state.flags.reduceMotion);
window.addEventListener('hashchange',render); render();
