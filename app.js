// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };
// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger")
// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
        track = stream.getTracks()[0];
        cameraView.srcObject = stream;
    })
    .catch(function(error) {
        console.error("Oops. Something is broken.", error);
    });
}
// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    
        // make exif data
        var zerothIfd = {};
        var exifIfd = {};
        var gpsIfd = {};
        zerothIfd[piexif.ImageIFD.Make] = "Maker Name";
        zerothIfd[piexif.ImageIFD.XResolution] = [777, 1];
        zerothIfd[piexif.ImageIFD.YResolution] = [777, 1];
        zerothIfd[piexif.ImageIFD.Software] = "Piexifjs";
        exifIfd[piexif.ExifIFD.DateTimeOriginal] = "2010:10:10 10:10:10";
        exifIfd[piexif.ExifIFD.LensMake] = "Lens Maker";
        exifIfd[piexif.ExifIFD.Sharpness] = 777;
        exifIfd[piexif.ExifIFD.LensSpecification] = [[1, 1], [1, 1], [1, 1], [1, 1]];
        gpsIfd[piexif.GPSIFD.GPSVersionID] = [7, 7, 7, 7];
        gpsIfd[piexif.GPSIFD.GPSDateStamp] = "1999:99:99 99:99:99";

        var lat = 59.43553989213321;
        var lng = 24.73842144012451;
        gpsIfd[piexif.GPSIFD.GPSLatitudeRef] = lat < 0 ? 'S' : 'N';
        gpsIfd[piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(lat);
        gpsIfd[piexif.GPSIFD.GPSLongitudeRef] = lng < 0 ? 'W' : 'E';
        gpsIfd[piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(lng);

        var exifObj = {"0th":zerothIfd, "Exif":exifIfd, "GPS":gpsIfd};

        // get exif binary as "string" type
        var exifBytes = piexif.dump(exifObj);

        // get JPEG image from canvas
        var jpegData = cameraSensor.toDataURL("image/webp", 1.0);

        // insert exif binary into JPEG binary(DataURL)
        var exifModified = piexif.insert(exifBytes, jpegData);

        // show JPEG modified exif
        var image = new Image();
        image.src = exifModified;
        image.width = 200;
        // for Modern IE
        if (saveJpeg) {
            var jpegBinary = atob(exifModified.split(",")[1]);
            var data = [];
            for (var p=0; p<jpegBinary.length; p++) {
                data[p] = jpegBinary.charCodeAt(p);
            }
            var ua = new Uint8Array(data);
            var blob = new Blob([ua], {type: "image/jpeg"});
            image.onclick = saveJpeg(blob);
        }
        var el = $("<div></div>").append(image);
        $("#resized").prepend(el);
   
        cameraOutput.src = image;
        cameraOutput.classList.add("taken");
    
};
// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);