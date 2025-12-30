document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch and include HTML content
    function includeHTML() {
        // Load header
        fetch('/_header.html')
            .then(response => response.text())
            .then(data => {
                document.querySelector('body').insertAdjacentHTML('afterbegin', data);
            });

        // Load footer
        fetch('/_footer.html')
            .then(response => response.text())
            .then(data => {
                document.querySelector('body').insertAdjacentHTML('beforeend', data);
            });
    }

    includeHTML();
});
