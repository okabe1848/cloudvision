import {Component} from '@angular/core';
import {NavController, AlertController} from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.page.html',
    styleUrls: ['./signin.page.scss'],
})
export class SigninPage {

    data: { email: string, password: string } = {email: '', password: ''};

    constructor(private navCtrl: NavController,
                private alertController: AlertController) {
    }

    async signIn() {
        try {
            await firebase
                .auth()
                .signInWithEmailAndPassword(this.data.email, this.data.password);

            this.navCtrl.navigateRoot('home');

        } catch (error) {
            const alert = await this.alertController.create({
                header: 'Error',
                message: error.message,
                buttons: ['OK']
            });
            alert.present();
        }
    }


}
