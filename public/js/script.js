/* console.log("script.js is linked"); */

(function () {
    new Vue({
        el: "#main",
        data: {
            images: [],
        },
        mounted: function () {
            /* console.log("My Vue has mounted"); */
            /* console.log("this outside axios: ", this); */

            var self = this;

            axios.get("/images").then(function (response) {
                /* console.log("this inside axios: ", this);
                console.log("response from /images: ", response); */
                self.images = response.data;
            });
        },

        methods: {
            myFunction: function () {
                console.log("My function is running");
            },
        },
    });
})();
