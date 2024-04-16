
    function scrollToCalculadoras() {
        var calculadorasSection = document.getElementById('calculadoras');
        calculadorasSection.scrollIntoView({ behavior: 'smooth' });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var urlParams = new URLSearchParams(window.location.search);
        var scrollToCalculadoras = urlParams.get('scrollToCalculadoras');

        if (scrollToCalculadoras === 'true') {
            var calculadorasSection = document.getElementById('calculadoras');
            
            if (calculadorasSection) {
                calculadorasSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
   