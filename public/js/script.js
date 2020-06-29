/* console.log("script.js is linked"); */

(function () {
    Vue.component("first-component", {
        template: "#template",
        props: ["id"],
        data: function () {
            return {
                url: self.url,
                title: self.title,
                description: self.description,
                username: self.username,
                created_at: self.created_at,
            };
        },
        mounted: function () {
            var self = this;
            /* console.log(this.id); */

            axios
                .get(`/imagesmore/${this.id}`)
                .then(function (response) {
                    /* console.log("this inside axios: ", this);
                    console.log("response from /images: ", response.data.title); */
                    self.url = response.data.url;
                    self.title = response.data.title;
                    self.description = response.data.description;
                    self.username = response.data.username;
                    self.created_at = response.data.created_at;
                    /* self.images = response.data; */
                })
                .catch(function (err) {
                    console.log("error in GET /images: ", err);
                });

            axios
                .get(`/comments/${this.id}`)
                .then(function (response) {
                    self.comment = response.data.comment;
                })
                .catch(function (err) {
                    console.log("error in GET /comments: ", err);
                });
        },

        methods: {
            setId: function () {
                console.log("I want to set the id in component");
                console.log("id when setting in component: ", id);
                console.log("id when setting in component: ", this);
                this.$emit("setId");
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            // adding data properties that will store the values of input fields
            title: "",
            description: "",
            username: "",
            file: null,
            id: null,
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

            setId: function (id) {
                console.log("id when setting in vue instance: ", id);
                this.id = id;
            },
        },
    });
})();
