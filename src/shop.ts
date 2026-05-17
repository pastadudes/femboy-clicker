import type { KAPLAYCtx, TweenController } from 'kaplay';
import stateActions from './state.ts';

interface ShopItem {
  text: string;
  cost: number;
  action: (k: KAPLAYCtx) => void;
}

const UPGRADES: ShopItem[] = [
  {
    text: "only tiny click power",
    cost: 50,

    action(_) {
      stateActions.clickPowerIncrement(1);
    },
  },
  {
    text: 'noobie autoclicker',
    cost: 100,

    action(k) {
      k.loop(1, () => stateActions.clickIncrement(1));
    },
  },
  {
    text: 'smol autoclicker',
    cost: 200,

    action(k) {
      k.loop(1, () => stateActions.clickIncrement(5));
    },
  },
];

function setupShop(k: KAPLAYCtx) {
  const shopWidth = 400;
  const tabWidth = 30;

  const openX = k.width() - 110;
  const closedX = k.width() + shopWidth / 2 - tabWidth;

  let shopOpen = false;
  let targetScale = k.vec2(1, 1);
  let currentTween: TweenController | null = null;

  const shop = k.add([
    k.rect(shopWidth, k.height() - 40, { radius: 4 }),
    k.color(30, 30, 30),
    k.pos(closedX, k.center().y),
    k.outline(2, k.rgb(255, 255, 255)),
    k.area(),
    k.anchor('center'),
    k.fixed(),
  ]);

  const shopHeight = k.height() - 40;
  const itemSpacing = 50;
  const startY = -shopHeight / 2 + 30;

  UPGRADES.forEach((upgrade, i) => {
    const btn = shop.add([
      k.pos(-40, startY + i * itemSpacing),
      k.text(`${upgrade.text}: ${upgrade.cost}`, { size: 18 }),
      k.area(),
      k.anchor('center'),
    ]);

    btn.onClick(() => {
      if (stateActions.getCopy().clicks >= upgrade.cost) {
        stateActions.clickIncrement(-upgrade.cost);
        upgrade.action(k);
      }
    });
  });

  // TODO: refactor ts into some ui helper like btn({someShit: 'blahblahblah'})
  const toggleBtn = k.add([
    k.rect(40, 60, { radius: 8 }),
    k.color(60, 60, 60),
    k.pos(k.width(), k.center().y),
    k.outline(2, k.rgb(140, 140, 140)),
    k.area(),
    k.anchor('center'),
    k.fixed(),
    k.z(10),
    k.scale(),
  ]);

  const arrow = toggleBtn.add([
    k.text('<', { size: 16 }),
    k.pos(0, 0),
    k.anchor('center'),
    k.color(200, 200, 200),
  ]);

  toggleBtn.onClick(() => {
    shopOpen = !shopOpen;
    arrow.text = shopOpen ? '>' : '<';
    slide();
  });

  k.onMouseMove(() => {
    if (shopOpen) return;
    const dist = k.width() - k.mousePos().x;
    if (dist < 100) {
      shopOpen = true;
      arrow.text = '>';
      slide();
    }
  });

  shop.onUpdate(() => {
    if (!shopOpen) return;
    const dist = k.width() - k.mousePos().x;
    if (dist > 150 && !toggleBtn.isHovering()) {
      shopOpen = false;
      arrow.text = '<';
      slide();
    }
  });

  toggleBtn.onUpdate(() => toggleBtn.pos.y = shop.pos.y);

  toggleBtn.onHover(() => {
    targetScale = k.vec2(1.5, 1.5);
  });

  toggleBtn.onHoverEnd(() => {
    targetScale = k.vec2(1, 1);
  });

  k.onUpdate(() => {
    toggleBtn.scale = k.vec2(
      k.lerp(toggleBtn.scale.x, targetScale.x, k.dt() * 30),
      k.lerp(toggleBtn.scale.y, targetScale.y, k.dt() * 30),
    );
  });

  function slide() {
    if (currentTween) currentTween.finish();
    const targetX = shopOpen ? openX : closedX;
    currentTween = k.tween(
      shop.pos.x,
      targetX,
      0.25,
      (val) => {
        shop.pos = k.vec2(val, shop.pos.y);
      },
      k.easings.easeOutCubic,
    );
  }
}

export default setupShop;
