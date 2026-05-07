import kaplay from "kaplay";
import stateActions from "./state.ts";
import setupShop from "./shop.ts";

const k = kaplay({
  debugKey: "f2",
  background: [255, 204, 255],
  width: 1280,
  height: 720,
  root: document.getElementById("game")!,
});

k.loadSprite("astoflo", "sprites/astoflo.webp");

const astofloSize = 1;

const cookie = k.add([
  k.sprite("astoflo"),
  k.pos(k.center()),
  k.anchor("center"),
  k.area(),
  k.scale(astofloSize),
  k.rotate(0),
]);

const scoreLabel = k.add([
  k.text(`score: ${stateActions.getCopy().clicks}`, { size: 48 }),
  k.pos(12, 12),
]);

cookie.onClick(() => {
  const currentState = stateActions.getCopy();
  stateActions.clickIncrement(currentState.clickPower);

  k.add([
    k.text(`+${currentState.clickPower}`, { size: 48 }),
    k.pos(k.mousePos()),
    k.move(k.UP, 100),
    k.opacity(1),
    k.lifespan(0.5, { fade: 0.5 }),
  ]);

  k.addKaboom(k.mousePos(), { scale: 0.5 });
});

cookie.onMouseDown("left", () => {
  if (cookie.isHovering()) stateActions.setHolding(true);
});

k.onMouseRelease("left", () => {
  stateActions.setHolding(false);
});

cookie.onUpdate(() => {
  if (stateActions.getCopy().holding) {
    const dir = k.mousePos().sub(cookie.pos.add(k.vec2(0, 20)));
    const targetAngle = dir.len() > 40
      ? k.clamp(dir.angle() * (180 / Math.PI), -20, 20)
      : 0;
    cookie.angle = k.lerp(cookie.angle, targetAngle, k.dt() * 20);
    cookie.scale = cookie.scale.lerp(k.vec2(astofloSize + astofloSize / 2), k.dt() * 20);
  } else {
    cookie.angle = k.lerp(cookie.angle, 0, k.dt() * 20);
    cookie.scale = cookie.scale.lerp(k.vec2(astofloSize), k.dt() * 20);
  }

  const liveState = stateActions.getCopy();
  scoreLabel.text = `score: ${liveState.clicks}`;
});

setupShop(k);
