export class Item {

  constructor() {}

  // item count
  id: number;

  // 物品系统标识名
  name: string;

  // 游戏显示名称
  displayName: string;

  // 调用模型组名字
  modelGroupName: string;

  // 调用模型数量
  numOfModel: number;

  // 调用物品模型
  modelName: string;

  // 调用替换模型（如剑鞘、前缀变化的装备）
  specialModelName: string;

  // 模型替换或显示条件：基数为0
  specialModelRules: number;

  // 物品类别，基数为0
  itemType: number;

  // 可行性
  availability: number;

  // 基础价格
  price: number;

  // 可拥有前缀：基数为0
  allowPrefix: number;

  // 重量
  weight: number;

  // 充足度
  toFill: number;

  // 头防；货品：质量
  headDef: number;

  // 体防；马：装甲(防护)；盾：抵抗（血）
  bodyDef: number;

  // 脚防；弩、枪：精度
  legDef: number;

  // 要求，如骑术、力气等；箭、矢、货品无效
  prerequisite: number;

  // 耐久
  durability: number;

  // 武器速度；马：操纵；枪弩：填充速度
  weaponSpeed: number;

  // 飞行物速度；马：速度
  speed: number;

  // 触及范围；盾：尺寸（覆盖范围）；掷器抛物线距离
  area: number;

  // 数量
  amount: number;

  // 穿刺带来的伤；马：冲刺(无伤害类别)
  damage: number;

}