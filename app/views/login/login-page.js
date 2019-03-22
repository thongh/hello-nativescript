var dialogsModule = require("tns-core-modules/ui/dialogs");
var frameModule = require("tns-core-modules/ui/frame");
var UserViewModel = require("../shared/view-models/user-view-model");
var page;
var email;
var isLoggingIn;
var isSigningIn;

var user = new UserViewModel({
    email: "thong.huynh@gmail.com",
    password: "password"
});

exports.loaded = function (args) {
    console.log("App loaded, now running the logic...")
    page = args.object;
    console.log("Setting up binding context");
    page.bindingContext = user;
    page.actionBarHidden = true;
    isLoggingIn = user.isLoggingIn;
    isSigningIn = false;
}

exports.toggleDisplay = function () {
    isLoggingIn = !isLoggingIn;
    user.set('isLoggingIn', isLoggingIn);
};

exports.submit = function () {
    if (isLoggingIn) {
        login();
    } else {
        signUp();
    }
};

function login() {
    user.set('isSigningIn', true);
    console.log("User clicks sign in button. Getting provided email address...");
    email = page.getViewById("email");
    var providedEmailAddr = email.text;
    console.log("Provided email address: " + providedEmailAddr);
    console.log("Provided password: " + user.password);

    user.login().catch(function (error) {
        console.log(error);
        dialogsModule.alert({
            message: "Unfortunately we could not find your account.",
            okButtonText: "OK"
        });
        return Promise.reject();
    }).then(function () {
        user.set('isSigningIn', false);
        frameModule.topmost().navigate("views/list/list-page");
    });
};

function signUp() {
    console.log("Register");
    user.register().then(function () {
        dialogsModule.alert("Your account was successfully created.").then(function () {
            exports.toggleDisplay();
        });
    }).catch(function (error) {
        dialogsModule.alert({
            message: "Unfortunately we were unable to create your account.",
            okButtonText: "OK"
        });
    });
};