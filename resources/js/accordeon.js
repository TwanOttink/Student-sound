let devices = document.getElementsByClassName('device-item');

let i;
for (i = 0; i < devices.length; i++) {
    devices[i].addEventListener("click", function () {
        if (this.classList.contains('open')) {
            this.classList.remove('open');
            return;
        }

        this.classList.add('open');
    });
}