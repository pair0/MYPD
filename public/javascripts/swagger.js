var iframe = document.getElementById('api_test');

var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
console.log(innerDoc.querySelector("#operations-MydataAuthorization-get_v1_oauth_2_0_authorize"))

var bar = innerDoc.querySelector("#operations-MydataAuthorization-get_v1_oauth_2_0_authorize")