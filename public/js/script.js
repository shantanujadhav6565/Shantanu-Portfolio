// =====================================================
// SHANTANU JADHAV PORTFOLIO - MAIN JAVASCRIPT
// =====================================================


// =====================================================
// DOM READY
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ Portfolio JavaScript Loaded");


    // =================================================
    // CONTACT FORM
    // =================================================

    const contactForm =
        document.getElementById("contactForm");

    const sendMessageBtn =
        document.getElementById("sendMessageBtn");

    const buttonText =
        document.getElementById("buttonText");

    const buttonLoading =
        document.getElementById("buttonLoading");


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            function () {

                // Disable submit button
                if (sendMessageBtn) {
                    sendMessageBtn.disabled = true;
                }


                // Hide normal button text
                if (buttonText) {
                    buttonText.classList.add("d-none");
                }


                // Show loading state
                if (buttonLoading) {
                    buttonLoading.classList.remove("d-none");
                }

            }
        );

    }


    // =================================================
    // NAVBAR AUTO CLOSE ON MOBILE
    // =================================================

    const navLinks =
        document.querySelectorAll(
            ".navbar-nav .nav-link"
        );

    const navbarCollapse =
        document.querySelector(
            ".navbar-collapse"
        );


    navLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                if (
                    navbarCollapse &&
                    navbarCollapse.classList.contains("show")
                ) {

                    const bsCollapse =
                        bootstrap.Collapse.getInstance(
                            navbarCollapse
                        );

                    if (bsCollapse) {

                        bsCollapse.hide();

                    }

                }

            }
        );

    });


    // =================================================
    // SMOOTH SCROLL
    // =================================================

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    this.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(targetId);


                if (target) {

                    event.preventDefault();


                    const navbar =
                        document.querySelector(
                            ".navbar"
                        );


                    const navbarHeight =
                        navbar
                            ? navbar.offsetHeight
                            : 0;


                    const targetPosition =
                        target.getBoundingClientRect().top +
                        window.pageYOffset -
                        navbarHeight;


                    window.scrollTo({

                        top: targetPosition,

                        behavior: "smooth"

                    });

                }

            }
        );

    });


    // =================================================
    // CURRENT YEAR
    // =================================================

    const currentYear =
        document.getElementById(
            "currentYear"
        );


    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


    // =================================================
    // AUTO HIDE ALERTS
    // =================================================

    const alerts =
        document.querySelectorAll(
            ".alert"
        );


    alerts.forEach(function (alert) {

        setTimeout(function () {

            if (
                alert.classList.contains(
                    "show"
                )
            ) {

                const bsAlert =
                    bootstrap.Alert.getOrCreateInstance(
                        alert
                    );

                bsAlert.close();

            }

        }, 5000);

    });


    // =================================================
    // SCROLL TO TOP BUTTON
    // =================================================

    const scrollTopBtn =
        document.getElementById(
            "scrollTopBtn"
        );


    if (scrollTopBtn) {

        window.addEventListener(
            "scroll",
            function () {

                if (window.scrollY > 400) {

                    scrollTopBtn.classList.remove(
                        "d-none"
                    );

                } else {

                    scrollTopBtn.classList.add(
                        "d-none"
                    );

                }

            }
        );


        scrollTopBtn.addEventListener(
            "click",
            function () {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );

    }


    // =================================================
    // EXTERNAL LINKS
    // =================================================

    const externalLinks =
        document.querySelectorAll(
            'a[target="_blank"]'
        );


    externalLinks.forEach(function (link) {

        link.setAttribute(
            "rel",
            "noopener noreferrer"
        );

    });


    // =================================================
    // CONTACT FORM VALIDATION
    // =================================================

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            function (event) {

                const name =
                    document.getElementById(
                        "name"
                    );

                const email =
                    document.getElementById(
                        "email"
                    );

                const message =
                    document.getElementById(
                        "message"
                    );


                let isValid = true;


                // Name validation

                if (
                    name &&
                    name.value.trim().length < 2
                ) {

                    name.classList.add(
                        "is-invalid"
                    );

                    isValid = false;

                } else if (name) {

                    name.classList.remove(
                        "is-invalid"
                    );

                }


                // Email validation

                if (email) {

                    const emailPattern =
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                    if (
                        !emailPattern.test(
                            email.value.trim()
                        )
                    ) {

                        email.classList.add(
                            "is-invalid"
                        );

                        isValid = false;

                    } else {

                        email.classList.remove(
                            "is-invalid"
                        );

                    }

                }


                // Message validation

                if (
                    message &&
                    message.value.trim().length < 5
                ) {

                    message.classList.add(
                        "is-invalid"
                    );

                    isValid = false;

                } else if (message) {

                    message.classList.remove(
                        "is-invalid"
                    );

                }


                // Stop form if validation fails

                if (!isValid) {

                    event.preventDefault();


                    // Reset loading button

                    if (sendMessageBtn) {

                        sendMessageBtn.disabled =
                            false;

                    }


                    if (buttonText) {

                        buttonText.classList.remove(
                            "d-none"
                        );

                    }


                    if (buttonLoading) {

                        buttonLoading.classList.add(
                            "d-none"
                        );

                    }

                }

            }
        );

    }

});