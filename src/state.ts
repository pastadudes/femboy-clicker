export interface State {
  clicks: number;
  clickPower: number;
  holding: boolean;
}

const state: State = {
  clicks: 0,
  clickPower: 1,
  holding: false,
};

export const stateActions = {
  clickIncrement(amount: number) {
    state.clicks += amount;
  },
  clickUpdate(newScore: number) {
    state.clicks = newScore;
  },
  clickPowerIncrement(amount: number) {
    state.clickPower += amount;
  },
  clickPowerUpdate(newClickPower: number) {
    state.clickPower = newClickPower;
  },
  setHolding(v: boolean) {
    state.holding = v;
  },
  getCopy() {
    return { ...state };
  },
};

export default stateActions;
