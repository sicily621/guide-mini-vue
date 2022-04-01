import { ShapeFlags } from "../shared/shapeFlags";
export function initSlots(instance, children) {
  const { vnode } = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN){
    normalizeObjectSlots(children, instance.slots);
  }
}
function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value];
}
function normalizeObjectSlots(children, slots) {
  for (const key in children) {
    const value = children[key];
    if (typeof value === "function") {
      slots[key] = (props) => normalizeSlotValue(value(props));
    }
  }
}
