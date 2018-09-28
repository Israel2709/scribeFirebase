'use strict';

describe('Controller: NewcollectionCtrl', function () {

  // load the controller's module
  beforeEach(module('scribeApp'));

  var NewcollectionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewcollectionCtrl = $controller('NewcollectionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NewcollectionCtrl.awesomeThings.length).toBe(3);
  });
});
