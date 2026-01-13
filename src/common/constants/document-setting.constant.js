import capitalizeFirstLetter from '../utils/capitalize-first-letter';

export const TRIGGER_ACTION = Object.freeze({
  NONE: 'NONE',
  DECREASE_INVENTORY: 'DECREASE_INVENTORY',
  RESERVE_INVENTORY: 'RESERVE_INVENTORY'
});

export const TRIGGER_ACTION_OPTIONS = [
  {
    label: capitalizeFirstLetter(TRIGGER_ACTION.NONE),
    value: TRIGGER_ACTION.NONE,
    defaultChecked: true
  },
  {
    label: 'Decrease product quantity from inventory',
    value: TRIGGER_ACTION.DECREASE_INVENTORY
  },
  {
    label: 'Reserve product quantity from inventory',
    value: TRIGGER_ACTION.RESERVE_INVENTORY
  }
];

export const defaultStatus = 'OPEN';
