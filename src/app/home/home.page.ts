import {Component, } from '@angular/core';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {GoogleCloudVisionService} from '../google-cloud-vision.service';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    result$: Observable<any>;

    imageSrc: any;

    processing: boolean;

    constructor(private camera: Camera, private vision: GoogleCloudVisionService) {
        this.openCam();
    }

    openCam() {
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };

        this.camera.getPicture(options).then((imageData) => {
            this.imageSrc = 'data:image/jpeg;base64,' + imageData;
            this.result$ = this.vision.getLabels(imageData).pipe(
                catchError(this.handleError<any>([]))
            );
        }, (err) => {
            console.log(`camera.getPicture.error=${JSON.stringify(err)}`);
        });
    }

    handleError<T>(result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }
}
