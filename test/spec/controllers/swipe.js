'use strict';

describe('Controller: SwipeCtrl', function () {

  // load the controller's module
  beforeEach(module('scribeApp'));

  var SwipeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SwipeCtrl = $controller('SwipeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SwipeCtrl.awesomeThings.length).toBe(3);
  });
});
