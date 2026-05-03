import { KAPLAYCtx } from "kaplay";
import stateActions from "./state";

interface ShopItem {
  text: string,
  cost: number,
  action: (k: KAPLAYCtx) => void
}

const UPGRADES: ShopItem[] = [
  {
    text: "buy noobie autoclicker",
    cost: 10,
    
    action(k) {
      k.loop(1, () => stateActions.clickIncrement(1))
    },
  },
  {
    text: "buy smol autoclicker",
    cost: 100,
    
    action(k) {
      k.loop(1, () => stateActions.clickIncrement(5))
    },
  }
];

function setupShop(k: KAPLAYCtx) {
  const shop = k.add([
    k.rect(400, k.height() - 40, { radius: 4 }),
    k.color(30, 30, 30),
    k.pos(k.width() - 110, k.center().y),
    k.outline(2, k.rgb(255, 255, 255)),
    k.area(),
    k.anchor("center"),
    k.fixed(),
  ]);

  UPGRADES.forEach((upgrade, i) => {
    const btn = shop.add([
      k.pos(-40, -400 + (i * 50)),
      k.text(`${upgrade.text}: ${upgrade.cost}`, { size: 18 }),
      k.area(),
      k.anchor("center")
    ]);

    btn.onClick(() => {
      if (stateActions.getCopy().clicks >= upgrade.cost) {
	stateActions.clickIncrement(-upgrade.cost);
	upgrade.action(k);
      }
    });
  })
}

export default setupShop;
