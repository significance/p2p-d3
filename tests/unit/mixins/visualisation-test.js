import Ember from 'ember';
import VisualisationMixin from 'p2p-d3/mixins/visualisation';
import { module, test } from 'qunit';

module('Unit | Mixin | visualisation');

// Replace this with your real tests.
test('it works', function(assert) {
  let VisualisationObject = Ember.Object.extend(VisualisationMixin);
  let subject = VisualisationObject.create();
  assert.ok(subject);
});
