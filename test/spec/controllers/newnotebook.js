'use strict';

describe('Controller: NewnotebookCtrl', function () {

  // load the controller's module
  beforeEach(module('scribeApp'));

  var NewnotebookCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewnotebookCtrl = $controller('NewnotebookCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NewnotebookCtrl.awesomeThings.length).toBe(3);
  });
});
