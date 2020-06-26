/* console.log("script.js is linked"); */

(function () {
    new Vue({
        el: "#main",
        data: {
            images: [],
            // adding data properties that will store the values of input fields
            title: "",
            description: "",
            username: "",
            file: null,
        },
        mounted: function () {
            /* console.log("My Vue has mounted"); */
            /* console.log("this outside axios: ", this); */
            var self = this;
            axios
                .get("/images")
                .then(function (response) {
                    /* console.log("this inside axios: ", this);
                console.log("response from /images: ", response); */

                    self.images = response.data;
                })
                .catch(function (err) {
                    console.log("error in GET /images: ", err);
                });
        },

        methods: {
            handleClick: function (e) {
                var self = this;
                e.preventDefault();
                /* console.log("this: ", this); */

                // we are only using formdata because we are working with a file!!!
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                axios
                    .post("/upload", formData)
                    .then(function (response) {
                        console.log("response from POST/upload", response);

                        self.images.unshift(response.data);
                    })
                    .catch(function (err) {
                        console.log("err in POST/upload:", err);
                    });
            },

            handleChange: function (e) {
                console.log("handleChange is running ");
                console.log("file: ", e.target.files[0]);
                this.file = e.target.files[0];
                console.log(("this after adding file to data: ", this));
            },
        },
    });
})();
