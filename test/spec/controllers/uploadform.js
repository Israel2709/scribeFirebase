'use strict';

describe('Controller: UploadformCtrl', function () {

  // load the controller's module
  beforeEach(module('scribeApp'));

  var UploadformCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UploadformCtrl = $controller('UploadformCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UploadformCtrl.awesomeThings.length).toBe(3);
  });
});
