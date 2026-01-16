interface ChangeStartAction {
  type: 'changeStart';
  payLoad: string;
}

interface ChangeEndAction {
  type: 'changeEnd';
  payLoad: string;
}

interface ResetAction {
  type: 'reset';
}

export type DateAction  = ChangeStartAction | ChangeEndAction | ResetAction;