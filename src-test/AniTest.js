AniTest = TestCase("AniTest");

AniTest.prototype.testAniExists = function(){
    jstestdriver.console.log("JsTestDriver", "testAniExists");
    assertObject(Ani);
}

AniTest.prototype.testApi = function(){
    jstestdriver.console.log("JsTestDriver", "testApi");
    assertFunction(Ani.init);
    assertFunction(Ani.autostart);
    assertFunction(Ani.noAutostart);
    assertFunction(Ani.overwrite);
    assertFunction(Ani.noOverwrite);
    assertFunction(Ani.cleanAnis); // TODO: do I need this?
    assertFunction(Ani.killAll); // TODO: do I need this?
    assertFunction(Ani.size); // TODO: do I need this
    assertFunction(Ani.register); // TODO: do I need this to be public
    assertFunction(Ani.unregister); // TODO: do I need this to be public
    assertFunction(Ani.update);
    assertFunction(Ani.to);
}