import { ConditionProps } from "./ConditionProps";

import { Group } from "@bpmn-io/properties-panel";

const LOW_PRIORITY = 500;

/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */
export default function CustomPropertiesProvider(propertiesPanel, translate) {
  // API ////////

  /**
   * Return the groups provided for the given element.
   *
   * @param {DiagramElement} element
   *
   * @return {(Object[]) => (Object[])} groups middleware
   */
  this.getGroups = function (element) {
    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function (groups) {
      groups.push(createConditionGroup(element, translate));

      // contract: if a group returns null, it should not be displayed at all
      return groups.filter((group) => group !== null);
    };
  };

  // registration ////////

  // Register our custom magic properties provider.
  // Use a lower priority to ensure it is loaded after
  // the basic BPMN properties.
  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

CustomPropertiesProvider.$inject = ["propertiesPanel", "translate"];

function createConditionGroup(element, translate) {
  const group = {
    label: "Condition",
    id: "CamundaPlatform__Condition",
    component: Group,
    entries: [...ConditionProps({ element })]
  };

  if (group.entries.length) {
    return group;
  }

  return null;
}
