import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {GoogleCloudVisionService} from '../google-cloud-vision.service';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import * as firebase from 'firebase';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    result$: Observable<any>;

    imageSrc: any;

    isDebug: boolean;

    error: string;

    constructor(private camera: Camera, private vision: GoogleCloudVisionService, private navCtrl: NavController) {
    }

    ngOnInit() {
        this.isDebug = environment.debug;
        this.error = null;

        const promise = new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    resolve();
                } else {
                    reject();
                }
            });
        });

        promise.then(() => {
            if (!this.isDebug) {
                this.openCam();
            }
        }).catch(() => {
            this.navCtrl.navigateRoot('signin');
        });
    }

    openCamMock() {
        this.result$ = null;
        this.error = null;
        this.imageSrc = '../assets/shapes.svg';

        const mock = {
            responses: [{
                labelAnnotations: [
                    {description: 'a', score: '0.1'}, {description: 'g', score: '0.7'},
                    {description: 'b', score: '0.2'}, {description: 'h', score: '0.8'},
                    {description: 'c', score: '0.3'}, {description: 'i', score: '0.9'},
                    {description: 'd', score: '0.4'}, {description: 'j', score: '0.1'},
                    {description: 'e', score: '0.5'}, {description: 'k', score: '0.2'},
                    {description: 'f', score: '0.6'}, {description: 'l', score: '0.3'},
                    {description: 'x', score: '0.4'}, {description: 'r', score: '0.4'},
                    {description: 'r', score: '0.5'}, {description: 'e', score: '0.5'},
                    {description: 'f', score: '0.6'}, {description: 'r', score: '0.6'},
                ]
            }]
        };
        // const mock = {responses: [{}]};
        setInterval(() => this.result$ = of(mock), 2000);
    }

    isResultEmpty(result) {
        if (!result || !result.responses || result.responses.length < 1) {
            return true;
        }
        if (result.responses.length === 1 && Object.keys(result.responses[0]).length < 1) {
            return true;
        }
        return false;
    }

    openCam() {
        if (this.isDebug) {
            this.openCamMock();
            return;
        }

        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };

        this.camera.getPicture(options).then((imageData) => {
            this.error = null;
            this.imageSrc = 'data:image/jpeg;base64,' + imageData;
            this.result$ = this.vision.getLabels(imageData).pipe(
                catchError(this.handleError<any>([]))
            );
        }, (err) => {
            console.log(`camera.getPicture.error=${JSON.stringify(err)}`);
            this.error = JSON.stringify(err);
        });
    }

    handleError<T>(result ?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }

    async signOut() {
        try {
            await firebase.auth().signOut();
            this.navCtrl.navigateRoot('signin');
        } catch (error) {
            console.log(`signout.error=${JSON.stringify(error)}`);
        }
    }
}
