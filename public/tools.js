// Curated from the current tool catalog and interface labels. Display data only.
export const categories = [
  {
    "id": "layout",
    "name": "排版与对象",
    "english": "ARRANGE"
  },
  {
    "id": "production",
    "name": "加工与制作",
    "english": "PRODUCE"
  },
  {
    "id": "image",
    "name": "图像与色彩",
    "english": "REFINE"
  },
  {
    "id": "content",
    "name": "文字与数据",
    "english": "CREATE"
  },
  {
    "id": "output",
    "name": "导出与交付",
    "english": "DELIVER"
  },
  {
    "id": "resources",
    "name": "素材与资源",
    "english": "EXPLORE"
  },
  {
    "id": "companions",
    "name": "实用与陪伴",
    "english": "ENJOY"
  },
  {
    "id": "personal",
    "name": "个性与设置",
    "english": "PERSONALIZE"
  }
];

export const tools = [
  {
    "id": "align",
    "name": "对齐",
    "category": "layout",
    "summary": "对齐、等距分布与行列排布，常用位置操作集中完成。",
    "benefits": [
      "六向对齐与绑定间距",
      "按中心或边缘等距均分",
      "按行列排列、复制与组对齐"
    ],
    "icon": "./assets/icons/align.png",
    "controls": [
      "对齐",
      "左侧",
      "顶部",
      "右侧",
      "水平居中",
      "底部",
      "垂直居中",
      "间距",
      "绑定对齐"
    ],
    "panel": "align",
    "width": 240
  },
  {
    "id": "size",
    "name": "尺寸",
    "category": "layout",
    "summary": "统一尺寸、定向调整与多种标注，规格看得更清楚。",
    "benefits": [
      "读取宽高并锁定比例调整",
      "批量统一尺寸与定向增减",
      "尺寸、间距、角度、框内标记及参数备注"
    ],
    "icon": "./assets/icons/size.png",
    "controls": [
      "目标尺寸",
      "锁定比例",
      "自动群组",
      "等宽",
      "等高",
      "获取尺寸",
      "统一尺寸",
      "调节尺寸",
      "调节值："
    ],
    "panel": "size",
    "width": 240
  },
  {
    "id": "select-same",
    "name": "选同",
    "category": "layout",
    "summary": "按尺寸、颜色、字体等条件，找出想要的同类对象。",
    "benefits": [
      "组合匹配条件与容差",
      "框选、本页或所有页查找",
      "对象替换、定距移动与复制"
    ],
    "icon": "./assets/icons/select-same.png",
    "controls": [
      "匹配参数",
      "尺寸",
      "宽度",
      "高度",
      "填充",
      "外框",
      "线宽",
      "线色",
      "文字"
    ],
    "panel": "select-same",
    "width": 240
  },
  {
    "id": "group",
    "name": "群组",
    "category": "layout",
    "summary": "按重叠与关联关系整理对象，让零散图形成组。",
    "benefits": [
      "重叠群组与智能群组",
      "设置外扩范围及描边扩线",
      "每组独立去色、去边或合并"
    ],
    "icon": "./assets/icons/group.png",
    "controls": [
      "范围",
      "选中对象",
      "本页全部",
      "外扩范围",
      "描边扩线",
      "显示扩线",
      "重叠群组",
      "智能群组",
      "去色"
    ],
    "panel": "group",
    "width": 240
  },
  {
    "id": "dedup",
    "name": "去重",
    "category": "layout",
    "summary": "检查重合、近似图形与重线，整理重复内容。",
    "benefits": [
      "按容差检查重合与近似对象",
      "去重与还原选择",
      "保留单线，清理重叠线段"
    ],
    "icon": "./assets/icons/dedup.png",
    "controls": [
      "重合",
      "近似",
      "重线",
      "容差",
      "检查",
      "去重",
      "还原选择",
      "保留单线",
      "取消"
    ],
    "panel": "dedup",
    "width": 240
  },
  {
    "id": "convert",
    "name": "转曲",
    "category": "layout",
    "summary": "批量转曲并处理外观，也能把对象沿曲线放置。",
    "benefits": [
      "只转文字、只转矢量或全部转曲",
      "去色、去边、细线与群组等后处理",
      "按数量或间距沿路径排列"
    ],
    "icon": "./assets/icons/convert.png",
    "controls": [
      "只转矢量图",
      "只转文字",
      "全部转曲",
      "转曲后处理（可多选）",
      "去色",
      "去边",
      "群组",
      "合并",
      "细线"
    ],
    "panel": "convert",
    "width": 240
  },
  {
    "id": "container",
    "name": "容器",
    "category": "layout",
    "summary": "置入、适配、缩放与释放内容，集中整理图框。",
    "benefits": [
      "置入顶层或底层容器",
      "微移、居中、拉伸与放大内部内容",
      "清空容器、批量加框与内容锁定"
    ],
    "icon": "./assets/icons/container.png",
    "controls": [
      "微移动",
      "距离",
      "↑ 上",
      "↓ 下",
      "← 左",
      "→ 右",
      "置入",
      "置入顶层",
      "置入底层"
    ],
    "panel": "container",
    "width": 240
  },
  {
    "id": "angle",
    "name": "角度",
    "category": "layout",
    "summary": "选基点、转角度、做镜像，图形朝向按需调整。",
    "benefits": [
      "九宫格旋转基点",
      "快捷角度与水平、垂直镜像",
      "读取角度并按设定值调整"
    ],
    "icon": "./assets/icons/angle.png",
    "controls": [
      "快捷旋转",
      "镜像",
      "⇋ 水平镜像",
      "⇅ 垂直镜像",
      "角度",
      "读取角度",
      "角度归零",
      "两点拉平",
      "随机旋转"
    ],
    "panel": "angle",
    "width": 300
  },
  {
    "id": "page",
    "name": "页面",
    "category": "layout",
    "summary": "辅助线、分页与跨页整理，把画面安排得有条理。",
    "benefits": [
      "按方向生成与删除辅助线",
      "按行列分页或合并页面",
      "对象分页与页面尺寸整理"
    ],
    "icon": "./assets/icons/page.png",
    "controls": [
      "辅助线",
      "颜色",
      "↑ 上",
      "↓ 下",
      "← 左",
      "→ 右",
      "竖线",
      "横线",
      "十字"
    ],
    "panel": "page",
    "width": 240
  },
  {
    "id": "scale",
    "name": "比例",
    "category": "layout",
    "summary": "用两点、线长或比例还原尺寸，随时查看对象数据。",
    "benefits": [
      "两点缩放与参考线长缩放",
      "图上尺寸与真实尺寸换算",
      "查看个数、总宽高、面积与线长"
    ],
    "icon": "./assets/icons/scale.png",
    "controls": [
      "两点缩放 · mm",
      "尺寸：",
      "两点缩放",
      "线长缩放法",
      "取参考线",
      "按线长缩放",
      "比例缩放法",
      "图上",
      "真实"
    ],
    "panel": "scale",
    "width": 240
  },
  {
    "id": "unlock",
    "name": "解锁",
    "category": "layout",
    "summary": "锁定、解锁、隐藏与查询，管理文档里的对象。",
    "benefits": [
      "解锁当前页或所有页",
      "锁定选择并临时查看锁定对象",
      "一键隐藏、显示与文件查询"
    ],
    "icon": "./assets/icons/unlock.png",
    "controls": [
      "解锁",
      "解锁此页",
      "解锁全页",
      "锁定对象",
      "显示锁定",
      "隐藏",
      "一键隐藏",
      "全显隐藏",
      "查询"
    ],
    "panel": "unlock",
    "width": 240
  },
  {
    "id": "nesting",
    "name": "省料",
    "category": "production",
    "summary": "设置板材、间距与旋转规则，预览多次排样方案。",
    "benefits": [
      "自定义材料尺寸与每对象数量",
      "控制旋转、边缘距离与最小间距",
      "普通或精确搜索，查看排样预览"
    ],
    "icon": "./assets/icons/nesting.png",
    "controls": [
      "排样预览",
      "尚未读取对象",
      "读取对象后开始排样",
      "材料尺寸 · mm",
      "宽度",
      "高度",
      "使用页面尺寸",
      "复制铺满一张板",
      "每对象数量"
    ],
    "panel": "nesting",
    "width": 860
  },
  {
    "id": "bridge",
    "name": "连筋",
    "category": "production",
    "summary": "给镂空文字与图形加桥位，也能手动连筋、断筋。",
    "benefits": [
      "按桥宽与跨距自动连筋",
      "分布文字、补桥与恢复文字",
      "手动连筋、断筋及自动焊接"
    ],
    "icon": "./assets/icons/bridge.png",
    "controls": [
      "桥位参数 · mm",
      "桥宽",
      "最大跨距倍数",
      "补桥",
      "横竖优先",
      "自动焊接",
      "生成与整理",
      "分布文字",
      "分布连筋"
    ],
    "panel": "bridge",
    "width": 240
  },
  {
    "id": "bleed",
    "name": "加工",
    "category": "production",
    "summary": "雕刻出血、PVC 封边、打样与白墨，围绕制作准备。",
    "benefits": [
      "沿图形轮廓生成雕刻出血",
      "PVC 封边展开、分段与搭接",
      "颜色打样与专色白墨输出"
    ],
    "icon": "./assets/icons/bleed.png",
    "controls": [
      "雕刻出血",
      "PVC 封边",
      "颜色打样",
      "专色白墨",
      "对象与轮廓",
      "读取选择",
      "记录起点",
      "尚未读取对象",
      "生成参数"
    ],
    "panel": "bleed",
    "width": 300
  },
  {
    "id": "keyhole",
    "name": "钥匙孔",
    "category": "production",
    "summary": "按八个方位生成孔位，独立设置四向偏移。",
    "benefits": [
      "设置内外孔径与上下左右偏移",
      "多选方位或一键全选八方向",
      "按需启用焊接、群组、耳朵与连接圆角"
    ],
    "icon": "./assets/icons/keyhole.svg",
    "controls": [
      "孔径与偏移 · mm",
      "孔内大小",
      "孔外大小",
      "上偏移",
      "下偏移",
      "左偏移",
      "右偏移",
      "开孔方位 · 可多选",
      "生成方式"
    ],
    "panel": "keyhole",
    "width": 240
  },
  {
    "id": "slot",
    "name": "槽孔",
    "category": "production",
    "summary": "立牌开槽与尺寸调整，把制作参数放在一起。",
    "benefits": [
      "设置板厚、凸槽宽度和数量",
      "控制底座、圆角、群组与焊接",
      "按方向修改宽高、间距与对齐"
    ],
    "icon": "./assets/icons/slot.png",
    "controls": [
      "立牌开槽",
      "立牌厚度",
      "凸槽宽",
      "凸槽数量",
      "凸槽厚",
      "底座宽",
      "左右",
      "上下",
      "圆角"
    ],
    "panel": "slot",
    "width": 240
  },
  {
    "id": "layout",
    "name": "盒子",
    "category": "production",
    "summary": "输入规格生成板材与包装展开，减少重复绘制。",
    "benefits": [
      "普通盒与包装盒分类",
      "按长宽高、厚度和间距生成展开",
      "圆柱、纸杯与梯形等形状参数"
    ],
    "icon": "./assets/icons/layout.png",
    "controls": [
      "普通盒 · 板材展开",
      "包装盒 · 展开展示",
      "盒形分类",
      "方形盒",
      "正方盒",
      "圆柱",
      "纸杯",
      "双边梯形",
      "四边梯形"
    ],
    "panel": "layout",
    "width": 710
  },
  {
    "id": "double-sided",
    "name": "对裱",
    "category": "production",
    "summary": "读取正反面、检查配对，让双面位置更好核对。",
    "benefits": [
      "读取正反面并检查配对",
      "正面、反面、换位及镂空对裱",
      "设置编号、显示绑定与跟随关系"
    ],
    "icon": "./assets/icons/double-sided.png",
    "controls": [
      "1.框选正面",
      "检查配对",
      "正面自动跟随",
      "正面对裱",
      "反面对裱",
      "换位对裱",
      "镂空对裱",
      "间距",
      "编号"
    ],
    "panel": "double-sided",
    "width": 240
  },
  {
    "id": "curve",
    "name": "弧面",
    "category": "production",
    "summary": "从基本形状到圆锥弧面，把尺寸变成展开图。",
    "benefits": [
      "矩形、梯形与多边形生成",
      "按顶径、底径和高度展开圆锥弧面",
      "控制板厚方向与内外尺寸"
    ],
    "icon": "./assets/icons/curve.png",
    "controls": [
      "画图形",
      "等边",
      "等腰",
      "梯形",
      "矩形",
      "边长",
      "边数",
      "腰长",
      "底宽"
    ],
    "panel": "curve",
    "width": 240
  },
  {
    "id": "image-cut",
    "name": "均切",
    "category": "production",
    "summary": "按份数横切、竖切，批量拆分大幅画面。",
    "benefits": [
      "设置切割份数与方向",
      "控制拼接、间距和出血",
      "选择图框、保留原图或转曲处理"
    ],
    "icon": "./assets/icons/image-cut.png",
    "controls": [
      "方向",
      "竖切",
      "横切",
      "范围",
      "选中",
      "当前页",
      "全部页",
      "处理",
      "图框"
    ],
    "panel": "image-cut",
    "width": 240
  },
  {
    "id": "size-cut",
    "name": "尺切",
    "category": "production",
    "summary": "按指定尺寸和次数切割，方便分块制作。",
    "benefits": [
      "上下左右选择切割方向",
      "自定义切割尺寸、次数与拼接",
      "支持选中、当前页或全部页范围"
    ],
    "icon": "./assets/icons/size-cut.png",
    "controls": [
      "方向",
      "↑ 上",
      "↓ 下",
      "← 左",
      "→ 右",
      "范围",
      "选中",
      "当前页",
      "全部页"
    ],
    "panel": "size-cut",
    "width": 240
  },
  {
    "id": "stroke",
    "name": "描边",
    "category": "production",
    "summary": "多层轮廓、透明图描边与节点整理，一处处理边线。",
    "benefits": [
      "设置出血距离、层数与轮廓筛选",
      "精简节点与智能优化",
      "按半径处理圆角、扇形角和棱角"
    ],
    "icon": "./assets/icons/stroke.png",
    "controls": [
      "出血 / 描边",
      "层数",
      "斜角",
      "圆角",
      "置顶",
      "置底",
      "出血后",
      "出血群组",
      "出血合并"
    ],
    "panel": "stroke",
    "width": 240
  },
  {
    "id": "point",
    "name": "点位",
    "category": "production",
    "summary": "批量添加圆点、方点、角线或自定义定位点。",
    "benefits": [
      "圆点、方点、角线与选中对象模板",
      "设置点宽高、偏移和颜色",
      "按需加框、垫白与自动群组"
    ],
    "icon": "./assets/icons/point.png",
    "controls": [
      "点类型",
      "圆点",
      "方点",
      "角线",
      "偏移 / 尺寸",
      "左偏",
      "上偏",
      "点宽",
      "点高"
    ],
    "panel": "point",
    "width": 240
  },
  {
    "id": "edge",
    "name": "寻边",
    "category": "production",
    "summary": "从工具入口调用寻边，衔接后续制作流程。",
    "benefits": [
      "从工具栏打开寻边工具",
      "配合图形轮廓进行寻边处理",
      "按寻边工具的参数完成制作准备"
    ],
    "icon": "./assets/icons/edge.png",
    "controls": [],
    "note": "寻边由对应辅助工具提供，界面与参数以工具实际打开的内容为准。"
  },
  {
    "id": "correct",
    "name": "矫正",
    "category": "image",
    "summary": "调整区域与透视，把拍摄图像和贴图摆正。",
    "benefits": [
      "拖动控制点调整矫正区域",
      "整体矫正、裁切矫正与贴图",
      "控制尺寸、颜色模式与光滑处理"
    ],
    "icon": "./assets/icons/correct.png",
    "controls": [
      "参数区",
      "颜色模式",
      "尺寸",
      "像素",
      "光滑处理",
      "重置",
      "浏览",
      "缩略预览区域",
      "导出图片"
    ],
    "panel": "correct",
    "width": 900
  },
  {
    "id": "watermark",
    "name": "水印",
    "category": "image",
    "summary": "给整页或选中内容添加图片水印，按需平铺。",
    "benefits": [
      "选择水印图片或从对象提取",
      "设置图片宽度与透明度",
      "平铺画面并应用到选中或整页"
    ],
    "icon": "./assets/icons/watermark.png",
    "controls": [
      "加水印",
      "修改水印图片",
      "从选中对象提取",
      "图片宽度",
      "透明度",
      "平铺整个画面",
      "应用到整页",
      "应用到选中"
    ],
    "panel": "watermark",
    "width": 240
  },
  {
    "id": "bitmap-outline",
    "name": "扩边",
    "category": "image",
    "summary": "读取图像轮廓，调整内外孔与边缘形状。",
    "benefits": [
      "选择外轮廓、内孔或内外孔",
      "去背景色与轮廓平滑",
      "扩边、圆角、斜角与参数预设"
    ],
    "icon": "./assets/icons/bitmap-outline.png",
    "controls": [
      "选择预设",
      "选择图形",
      "适合",
      "画笔",
      "不透明度 %",
      "深浅",
      "轮廓识别",
      "平滑",
      "去色"
    ],
    "panel": "bitmap-outline",
    "width": 900
  },
  {
    "id": "cutout",
    "name": "抠图",
    "category": "image",
    "summary": "分离图像背景，并为边缘和指定颜色留出控制。",
    "benefits": [
      "调整阈值、前景和背景抑制",
      "保护指定颜色及框选区域",
      "GPU 优先，不可用时回落 CPU"
    ],
    "icon": "./assets/icons/cutout.png",
    "controls": [
      "抠图参数",
      "阈值",
      "前景增强",
      "背景抑制",
      "边缘平滑",
      "保护指定颜色",
      "仅在框选区域保护",
      "吸色 / 框选",
      "重新读取选中图"
    ],
    "panel": "cutout",
    "width": 310
  },
  {
    "id": "vectorize",
    "name": "矢量",
    "category": "image",
    "summary": "在转换预览中调整参数，再把矢量结果导回文档。",
    "benefits": [
      "从文档对象或文件发起转换",
      "在转换预览中调整参数",
      "导入文件与导出转换结果"
    ],
    "icon": "./assets/icons/vectorize.png",
    "controls": [
      "刷新",
      "转换预览与参数",
      "主页",
      "导入文件",
      "导出文件",
      "取消处理",
      "网页 100%"
    ],
    "panel": "vectorize",
    "width": 980
  },
  {
    "id": "palette",
    "name": "色盘",
    "category": "image",
    "summary": "取色、搭配与收藏，把喜欢的颜色留在色样库。",
    "benefits": [
      "查找相近颜色与搭配方案",
      "分类管理与收藏色样",
      "导入、导出色样库并应用到对象"
    ],
    "icon": "./assets/icons/palette.png",
    "controls": [
      "取色",
      "相近搜索",
      "搜索搭配色",
      "收藏搭配色",
      "导入 CDR",
      "导入色样库",
      "导出色样库",
      "色样库",
      "推荐色"
    ],
    "panel": "palette",
    "width": 720
  },
  {
    "id": "selection-capture",
    "name": "截图",
    "category": "image",
    "summary": "选中对象即截图，透明区与备注也能一并处理。",
    "benefits": [
      "自定义 DPI 并复制到剪贴板",
      "附带备注、背景和外扩",
      "裁切透明区域与批量裁切"
    ],
    "icon": "./assets/icons/selection-capture.png",
    "controls": [
      "附带备注",
      "附带背景",
      "颜色",
      "外扩",
      "截图到剪贴板",
      "裁切透明区",
      "保留原图",
      "图框裁切",
      "批量裁切透明区"
    ],
    "panel": "selection-capture",
    "width": 240
  },
  {
    "id": "color",
    "name": "换色",
    "category": "image",
    "summary": "批量替换颜色、转换模式，也能提取对象配色。",
    "benefits": [
      "读取新旧色并指定替换范围",
      "分别处理文本、填充与边框",
      "提取颜色、排布色卡与模式转换"
    ],
    "icon": "./assets/icons/color.png",
    "controls": [
      "颜色",
      "旧色",
      "取旧色",
      "新色",
      "取新色",
      "新旧互换",
      "范围",
      "选择对象",
      "当前页面"
    ],
    "panel": "color",
    "width": 240
  },
  {
    "id": "ocr",
    "name": "识字",
    "category": "content",
    "summary": "提取图中文字、原位回填，并处理文本翻译。",
    "benefits": [
      "提取文字并编辑、复制与清理",
      "原位识别与回填所选文字",
      "文本翻译、双语与批量回填"
    ],
    "icon": "./assets/icons/ocr.png",
    "controls": [
      "提取文字",
      "打开面板",
      "自动注入",
      "复制内容",
      "清理空格",
      "自动换行",
      "原位回填",
      "文本翻译",
      "自动检测"
    ],
    "panel": "ocr",
    "width": 260
  },
  {
    "id": "two-dimensional",
    "name": "二维",
    "category": "content",
    "summary": "二维码、条码与表格数据放在一起，支持批量生成。",
    "benefits": [
      "生成与解析二维码",
      "选择 Code128、EAN 等条码类型",
      "读取表格数据并逐行或批量处理"
    ],
    "icon": "./assets/icons/two-dimensional.png",
    "controls": [
      "二维码 / 条码生成",
      "二维码解析",
      "Excel 数据",
      "选择文件",
      "粘贴表格",
      "清空表格",
      "数据列",
      "0 行",
      "首行标题"
    ],
    "panel": "two-dimensional",
    "width": 560
  },
  {
    "id": "banner",
    "name": "横幅",
    "category": "content",
    "summary": "一行一条横幅，统一字体、规格与落款样式。",
    "benefits": [
      "按文本行批量生成横幅或竖幅",
      "分别设置正文、落款与布长布高",
      "设置颜色、裁切标记与逐条群组"
    ],
    "icon": "./assets/icons/banner.png",
    "controls": [
      "字体与尺寸 · mm",
      "正文字体",
      "获取字体",
      "落款字体",
      "布长",
      "布高",
      "字高",
      "边距",
      "条幅间距"
    ],
    "panel": "banner",
    "width": 410
  },
  {
    "id": "word-cloud",
    "name": "云词",
    "category": "content",
    "summary": "把文字与对象填入外形，做有节奏的创意排布。",
    "benefits": [
      "添加对象与自定义外形",
      "控制随机大小、颜色、角度和间距",
      "词云、蜂窝与环绕等填充方式"
    ],
    "icon": "./assets/icons/word-cloud.png",
    "controls": [
      "添加对象",
      "添加外形",
      "开始生成",
      "对象名称",
      "尺寸 mm",
      "数量",
      "清除",
      "外形：未添加",
      "生成参数"
    ],
    "panel": "word-cloud",
    "width": 240
  },
  {
    "id": "calendar",
    "name": "日历",
    "category": "content",
    "summary": "按年月生成月历，字体、农历与节日自由搭配。",
    "benefits": [
      "设置年份、月份与整体尺寸",
      "分别设置日期、农历和星期字体",
      "控制节日、邻月日期与网格"
    ],
    "icon": "./assets/icons/calendar.png",
    "controls": [
      "年份",
      "月份",
      "当前月份",
      "日期号字体",
      "获取字体",
      "农历字体",
      "星期字体",
      "四边间距",
      "日期颜色"
    ],
    "panel": "calendar",
    "width": 430
  },
  {
    "id": "font-manager",
    "name": "字管",
    "category": "content",
    "summary": "预览系统字体、建立分类，给文字选一副合适的样子。",
    "benefits": [
      "按分类与样例浏览字体",
      "读取文字并生成字体对比",
      "应用、收藏与导出字体"
    ],
    "icon": "./assets/icons/font-manager.png",
    "controls": [
      "新建",
      "清选",
      "编辑",
      "删除",
      "读取文字",
      "生成对比",
      "导出字体",
      "应用字体"
    ],
    "panel": "font-manager",
    "width": 420
  },
  {
    "id": "text",
    "name": "文字",
    "category": "content",
    "summary": "字体字号、拼音与文本整理，常用文字操作集中做。",
    "benefits": [
      "同步获取字体与字号",
      "空格空行、大小写与拼音整理",
      "文本重组、拆分与转曲"
    ],
    "icon": "./assets/icons/text.png",
    "controls": [
      "修改字体",
      "获取字体",
      "颜色",
      "选择文字",
      "添加预设",
      "管理预设",
      "识别字体",
      "粘贴剪贴板",
      "粘贴文本"
    ],
    "panel": "text",
    "width": 240
  },
  {
    "id": "note",
    "name": "备注",
    "category": "content",
    "summary": "用序号、字母和尺寸代号，批量生成对象备注。",
    "benefits": [
      "支持序号、字母和尺寸等代号",
      "九宫格位置、偏移与文字样式",
      "保存、搜索与管理备注预设"
    ],
    "icon": "./assets/icons/note.png",
    "controls": [
      "备注内容",
      "创建预设",
      "搜索",
      "预设名称",
      "文字颜色",
      "生成顺序",
      "Z 序（正）",
      "N 序（倒）",
      "放置位置"
    ],
    "panel": "note",
    "width": 240
  },
  {
    "id": "data",
    "name": "数据",
    "category": "content",
    "summary": "把表格字段绑定到模板对象，生成批量内容与编号。",
    "benefits": [
      "导入或粘贴表格并编辑字段",
      "字段绑定到 CDR 对象",
      "极速编号、行列阵列与一键生成"
    ],
    "icon": "./assets/icons/data.png",
    "controls": [
      "粘贴表格",
      "导入表格",
      "复制表格",
      "删除空格",
      "删除空列",
      "刷新",
      "清空界面",
      "起始编号",
      "跳过编号"
    ],
    "panel": "data",
    "width": 880
  },
  {
    "id": "clipboard-bridge",
    "name": "转换",
    "category": "output",
    "summary": "在 CDR、AI、CAD 和表格之间衔接常用内容。",
    "benefits": [
      "CDR 与 AI 之间传递矢量",
      "导入 CAD 并按需统一细线与颜色",
      "粘贴可编辑的矢量表格"
    ],
    "icon": "./assets/icons/clipboard-bridge.png",
    "controls": [
      "CDR 转 AI",
      "AI 转 CDR",
      "CAD 导入 CDR",
      "全部转换为细线",
      "颜色统一为黑色",
      "粘贴表格",
      "去除白色单元格底色"
    ],
    "panel": "clipboard-bridge",
    "width": 240
  },
  {
    "id": "print",
    "name": "打印",
    "category": "output",
    "summary": "确认打印对象，再看预览、设置份数与纸张。",
    "benefits": [
      "选择打印机、纸张与方向",
      "控制份数、颜色和页码范围",
      "确认对象并检查打印预览"
    ],
    "icon": "./assets/icons/print.png",
    "controls": [
      "已选 0 个打印对象",
      "识别顺序",
      "打印机",
      "设置",
      "份数",
      "颜色",
      "页码",
      "当前页",
      "全部打印"
    ],
    "panel": "print",
    "width": 240
  },
  {
    "id": "export",
    "name": "导图",
    "category": "output",
    "summary": "按选区或页面输出图片，格式、精度与颜色按需设置。",
    "benefits": [
      "设置格式、分辨率与颜色模式",
      "控制透明、光滑、压缩与输出尺寸",
      "选中、当前页或全部页导出"
    ],
    "icon": "./assets/icons/export.png",
    "controls": [
      "名称",
      "导出目录",
      "浏览",
      "绑备注",
      "绑新色",
      "单位：",
      "格式",
      "颜色",
      "像素"
    ],
    "panel": "export",
    "width": 240
  },
  {
    "id": "save-as",
    "name": "另存",
    "category": "output",
    "summary": "选取另存、转曲另存与批量存，整理不同版本文件。",
    "benefits": [
      "选择保存版本、名称和目录",
      "设置前后缀、日期与转曲",
      "选取另存、批量存与高版本辅助导入"
    ],
    "icon": "./assets/icons/save-as.png",
    "controls": [
      "文件名",
      "前缀",
      "后缀",
      "日期",
      "版本",
      "转曲",
      "实际文件名：-",
      "保存目录",
      "浏览"
    ],
    "panel": "save-as",
    "width": 240
  },
  {
    "id": "psd",
    "name": "转PS",
    "category": "output",
    "summary": "设置分辨率与颜色，把设计转入 Photoshop。",
    "benefits": [
      "识别或选择 Photoshop 程序",
      "设置颜色模式与分辨率",
      "按单层或多层转入"
    ],
    "icon": "./assets/icons/psd.png",
    "controls": [
      "识别 PS",
      "选择目录",
      "输出设置",
      "颜色",
      "分辨率",
      "自动分辨率",
      "转入单层",
      "转入多层"
    ],
    "panel": "psd",
    "width": 240
  },
  {
    "id": "pdf",
    "name": "导PDF",
    "category": "output",
    "summary": "单页、多页与质量档位，按交付需要输出 PDF。",
    "benefits": [
      "导出单页或多页 PDF",
      "选择质量、RGB、CMYK 或灰度",
      "文字转曲及 PDF 导入"
    ],
    "icon": "./assets/icons/pdf.png",
    "controls": [
      "输出目录",
      "选择",
      "文件名",
      "导出单页PDF",
      "导出多页PDF",
      "原高清",
      "印刷级",
      "高质量",
      "中质量"
    ],
    "panel": "pdf",
    "width": 240
  },
  {
    "id": "web-icon",
    "name": "图标",
    "category": "resources",
    "summary": "按关键词搜索图标，给设计补上合适的小元素。",
    "benefits": [
      "关键词搜索图标",
      "按页浏览与刷新结果",
      "从图标列表挑选所需元素"
    ],
    "icon": "./assets/icons/web-icon.png",
    "controls": [
      "搜索",
      "刷新",
      "输入关键词开始搜索"
    ],
    "panel": "web-icon",
    "width": 250
  },
  {
    "id": "ai-browser",
    "name": "豆包",
    "category": "resources",
    "summary": "在工作窗口打开 AI 对话，并管理常用提示词。",
    "benefits": [
      "对话、导航与页面缩放",
      "插文、插图与截图衔接",
      "管理快捷提示词与预设"
    ],
    "icon": "./assets/icons/ai-browser.png",
    "controls": [
      "选择预设",
      "刷新",
      "打开",
      "新对话",
      "插图",
      "插文",
      "截图",
      "管理",
      "预设"
    ],
    "panel": "ai-browser",
    "width": 900
  },
  {
    "id": "website",
    "name": "网站",
    "category": "resources",
    "summary": "把常用网站集中管理，衔接复制与下载内容。",
    "benefits": [
      "创建、管理并访问网站",
      "网页导航与万能复制",
      "按设置自动导入下载或复制内容"
    ],
    "icon": "./assets/icons/website.png",
    "controls": [
      "创建网站",
      "管理网站",
      "访问",
      "自动导入",
      "万能复制",
      "下载目录",
      "选择网站或输入网址"
    ],
    "panel": "website",
    "width": 880
  },
  {
    "id": "search",
    "name": "搜寻",
    "category": "resources",
    "summary": "按文件名和修改日期查找，缩短翻文件的过程。",
    "benefits": [
      "输入关键词查找文件",
      "按修改时间排序",
      "用起止日期筛选结果"
    ],
    "icon": "./assets/icons/search.png",
    "controls": [
      "搜寻",
      "修改时间排序",
      "最新优先",
      "最早优先",
      "起始日期",
      "选择日期",
      "结束日期",
      "筛选",
      "清空筛选"
    ],
    "panel": "search",
    "width": 900
  },
  {
    "id": "asset",
    "name": "素材",
    "category": "resources",
    "summary": "按目录浏览、存入与导入素材，让常用文件更好找。",
    "benefits": [
      "缩略图浏览 CDR、PNG、JPG 等素材",
      "书签、格式筛选与排序",
      "把选择存入素材库或导入文档"
    ],
    "icon": "./assets/icons/asset.png",
    "controls": [
      "加入书签",
      "管理书签",
      "选择目录",
      "打开目录",
      "缩略图",
      "名称：自然顺序",
      "名称：倒序",
      "修改时间：最新",
      "修改时间：最早"
    ],
    "panel": "asset",
    "width": 900
  },
  {
    "id": "entertainment",
    "name": "视频",
    "category": "companions",
    "summary": "集中打开可访问的视频地址，工作间隙轻松观看。",
    "benefits": [
      "输入直链或官方嵌入地址",
      "切换直接播放与站点解析",
      "管理常用视频站点"
    ],
    "icon": "./assets/icons/entertainment.png",
    "controls": [
      "站点解析",
      "直接播放",
      "立即播放",
      "刷新",
      "创建网站",
      "管理网站",
      "请输入视频地址"
    ],
    "panel": "entertainment",
    "width": 920
  },
  {
    "id": "warehouse",
    "name": "仓库",
    "category": "companions",
    "summary": "钥匙孔、计算器与可爱小游戏，随时按需打开。",
    "benefits": [
      "实用工具：钥匙孔、计算器",
      "五子棋、围棋、象棋、麻将与斗地主",
      "跳跳棋、扫雷和萌宠消除"
    ],
    "icon": "./assets/icons/warehouse.png",
    "controls": [
      "四川麻将",
      "广东麻将",
      "杭州麻将",
      "陕西麻将",
      "简单",
      "普通",
      "困难",
      "经典局",
      "快速局"
    ],
    "panel": "warehouse",
    "width": 290
  },
  {
    "id": "calculator",
    "name": "计算器",
    "category": "companions",
    "summary": "大数字键、键盘输入与历史记录，算数也能很顺手。",
    "benefits": [
      "数字、加减乘除与回车计算",
      "括号、百分比和科学计算",
      "查看历史结果并复制答案"
    ],
    "icon": "./assets/icons/calculator.svg",
    "controls": [
      "科学",
      "历史",
      "角度制",
      "复制",
      "使用结果",
      "清空历史"
    ],
    "panel": "calculator",
    "width": 240
  },
  {
    "id": "music",
    "name": "音乐",
    "category": "companions",
    "summary": "听歌、收藏与管理歌单，让工作多一点陪伴。",
    "benefits": [
      "搜索和播放音乐",
      "管理收藏与歌单",
      "通过收纳箱播放控件控制音乐"
    ],
    "icon": "./assets/icons/music.svg",
    "controls": [],
    "note": "音乐播放与收藏在独立音乐界面中管理。可使用“存盘”导出支持的收藏与歌单。"
  },
  {
    "id": "pet",
    "name": "宠物",
    "category": "companions",
    "summary": "在桌面留一位可爱的小伙伴，陪伴工作间隙。",
    "benefits": [
      "打开桌面萌宠",
      "在独立窗口中互动",
      "根据宠物工具设置调整使用习惯"
    ],
    "icon": "./assets/icons/pet.svg",
    "controls": [],
    "note": "桌面宠物为独立辅助窗口，可按需打开。"
  },
  {
    "id": "toolbox",
    "name": "收纳箱",
    "category": "personal",
    "summary": "搜索工具、收纳入口，把常用功能放在手边。",
    "benefits": [
      "按首字母或功能名搜索",
      "打开设置、快捷键与音乐控制",
      "查看运行信息并整理工具入口"
    ],
    "icon": "./assets/icons/toolbox.png",
    "controls": [
      "收纳箱",
      "搜索：首字母或功能名",
      "设置中心",
      "快捷键",
      "音量",
      "内存：--%",
      "最后保存时间：--",
      "卡密：--"
    ],
    "panel": "toolbox",
    "width": 240
  },
  {
    "id": "disk",
    "name": "存盘",
    "category": "personal",
    "summary": "按工具分享参数，或一次导出整套配置与预设。",
    "benefits": [
      "单工具参数与命名预设导出",
      "全部参数 ZIP 导出及导入",
      "不分享账号、网页登录与密钥"
    ],
    "icon": "./assets/icons/disk.png",
    "controls": [
      "工具参数与预设",
      "搜索工具 / 关键词",
      "导出所选工具",
      "全部导出 ZIP",
      "导入参数 ZIP"
    ],
    "panel": "disk",
    "width": 400
  },
  {
    "id": "shortcut",
    "name": "快捷键",
    "category": "personal",
    "summary": "录制常用组合键，也能联动打开多个工具。",
    "benefits": [
      "按键录制工具快捷键",
      "设置覆盖同组合键的行为",
      "一个组合键联动多个工具"
    ],
    "icon": "./assets/icons/shortcut.svg",
    "controls": [
      "联动快捷",
      "添加联动",
      "已添加",
      "保存并刷新"
    ],
    "panel": "shortcut",
    "width": 240
  },
  {
    "id": "toolbar-custom",
    "name": "调整工具栏",
    "category": "personal",
    "summary": "按习惯显示或收纳工具，让工具栏更合手。",
    "benefits": [
      "选择需要显示的工具",
      "把暂不用的功能收进收纳箱",
      "保存刷新或恢复默认布局"
    ],
    "icon": "./assets/icons/toolbar-custom.svg",
    "controls": [
      "保存",
      "取消"
    ],
    "panel": "toolbar-custom",
    "width": 420
  },
  {
    "id": "settings",
    "name": "设置中心",
    "category": "personal",
    "summary": "统一管理外观、字体和提示位置，打造自己的工具环境。",
    "benefits": [
      "白色、深色与自定义界面色",
      "默认字体、图标与外观设置",
      "拖动设置悬浮提示位置并重置"
    ],
    "icon": "./assets/icons/settings.svg",
    "controls": [],
    "note": "在收纳箱打开设置中心，可统一调整插件的外观与交互习惯。"
  }
];
