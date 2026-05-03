import kaplay from "kaplay";

const k = kaplay();

// k.loadRoot("./");
k.loadSprite("astoflo", "sprites/astoflo.webp");

const astofloSize = 1;

const cookie = k.add([
  k.sprite("astoflo"),
  k.pos(k.center()),
  k.anchor("center"),
  k.area(),
  k.scale(astofloSize),
]);

let score = 0;
const scoreLabel = k.add([k.text(score, { size: 48 }), k.pos(24, 24)]);

cookie.onClick(() => {
  score += 1;
  scoreLabel.text = score;

  cookie.scale = k.vec2(astofloSize + astofloSize / 2);
  k.add([
    k.text("+1", { size: 48 }),
    k.pos(k.mousePos()),
    k.move(k.UP, 100),
    k.opacity(1),
    k.lifespan(0.5, { fade: 0.5 }),
  ]);

  // placeholder
  k.addKaboom(k.mousePos(), { scale: 0.5 });
}, "left");

// return astoflo to normal size every frame
cookie.onUpdate(() => {
  cookie.scale = cookie.scale.lerp(k.vec2(astofloSize), k.dt() * 10);
});
