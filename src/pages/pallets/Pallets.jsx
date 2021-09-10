import {
  IonContent,
  IonPage,
  IonButton,
  IonToolbar,
  IonTitle,
  IonToast,
  IonLabel,
  IonItem,
  IonActionSheet,
  IonAlert,
  IonHeader,
  IonBackButton,
  IonLoading
} from '@ionic/react'
import React from 'react'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

import { url } from '../../config/config'
import { App } from '@capacitor/app';


const Pallets = props => {

  App.addListener('backButton', () => {
    setHideHomePage(false)
  })

  //Visibility Variables
  const [hideHomePage, setHideHomePage] = React.useState(false) //vero= mostra fotocamera falso= mostra homepage
  const [showAlertQuantity, setShowAlertQuantity] = React.useState(false) //per inserire nuova quantità del pallets
  const [showAlertNewQuantity, setShowAlertNewQuantity] = React.useState(false) //per inserire quantità del nuovo pallets
  const [showToastSendButton, setShowToastSendButton] = React.useState(false) //barra sotto per invio
  const [showToastCancelButton, setShowToastCancelButton] = React.useState(false) //barra sotto per annulla
  const [showToastError, setShowToastError] = React.useState(false) //barra sotto per annulla
  const [showToastEmptyField, setShowToastEmptyField]= React.useState(false) // controlla che i campi siano pieni
  const [showActionSheet, setShowActionSheet] = React.useState(false) //barra dopo premuto invio
  const [showLoadingDatabase,setShowLoadingDatabase] = React.useState(false) //Alert mentre si caricano le info sul DB

  //Query Variables
  const [code, setCode] = React.useState()
  const [newCode, setNewCode] = React.useState()
  const [quantity, setQuantity] = React.useState(0)
  const [newQuantity, setNewQuantity] = React.useState(0)

  const checkPermission = async (pulsante) => {
    const status = await BarcodeScanner.checkPermission({ force: true });     //chiede permesso fotocamera
    if (status.granted) { startScan(pulsante) }
    };

  const startScan = async (pulsante) => {
    setHideHomePage(true)    //fa vedere la fotocamera
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {if (pulsante===0) {setCode(result.content);}
                            if (pulsante===1) {setNewCode(result.content);}
                            setHideHomePage(false);   //fa vedere la pagina
                            }
  };

  const postPallets = async ()=> {
    if ((code===undefined)||(newCode===undefined)||(quantity<=0)||(newQuantity<=0)){
      setShowToastEmptyField(true);
    }
    else {
      setShowLoadingDatabase(true);
      var data = {"qr" : code, "nuova_qt":quantity,"nuovo_qr":newCode,"qt_sottratta":newQuantity};
      try {
        await fetch(url,{
          method: 'POST', 
          mode: 'cors', 
          cache: 'no-cache', 
          credentials: 'same-origin', 
          headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        setShowToastSendButton(true)
        setCode();
        setQuantity(0);
        setNewCode();
        setNewQuantity(0);
      }
      catch(error){
        setShowToastError(true);
      }
    setShowLoadingDatabase(false);
  }
}

    if (hideHomePage === false){
    return (
    <IonPage>
    <IonToolbar>
        <IonTitle>Home page</IonTitle>
    </IonToolbar>
    <IonContent>

      <IonAlert
          isOpen={showAlertQuantity}
          onDidDismiss={() => setShowAlertQuantity(false)}
          header={'Inserisci nuova quantità'}
          inputs={[
            {
              name: 'name',
              type: 'number',
              placeholder: 'Quantità',
              min:1
            },         
          ]}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {}
            },
            {
              text: 'Ok',
              handler: data => {
                setQuantity(parseInt(data.name))
              }
            }
          ]}
        />

        <IonAlert
          isOpen={showAlertNewQuantity}
          onDidDismiss={() => setShowAlertNewQuantity(false)}
          cssClass='my-custom-class'
          header={'Inserisci quantità sottratta'}
          inputs={[
            {
              name: 'name',
              type: 'number',
              placeholder: 'Quantità',
            },         
          ]}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {}
            },
            {
              text: 'Ok',
              handler: data => {
                setNewQuantity(parseInt(data.name))
              }
            }
          ]}
        />

        <IonLoading
          isOpen={showLoadingDatabase}
          onDidDismiss={() => setShowLoadingDatabase(false)}
          message={'Connessione al Database'}
                 
        />

        <IonActionSheet 
            isOpen={showActionSheet}
            onDidDismiss={() => setShowActionSheet(false)}
            header= {"Vuoi inviare " + quantity + " oggetti e " + newQuantity + " oggetti?"}
            buttons={[{
              text: 'Invio',
              handler: () => { 
                postPallets();
                }
            },  {
              text: 'Annulla',
              handler: () => {setShowToastCancelButton(true)}
            }]}>
        </IonActionSheet>

        <IonToast //Chiamato quando si conferma l'invio
            isOpen={showToastSendButton}
            duration={1000}
            onDidDismiss={() => setShowToastSendButton(false)}    //dopo 2 secondi si chiude e setta a false
            message="Operazione completata"
            position="bottom"
            color="success"
          />
          <IonToast //Chiamato quando si annulla l'invio
            isOpen={showToastCancelButton}
            duration={1000}
            onDidDismiss={() => setShowToastCancelButton(false)}    //dopo 2 secondi si chiude e setta a false
            message="Operazione annullata"
            position="bottom"
            color="danger"
          />

          <IonToast //Chiamato quando la connessione con il DB non va a buon fine
            isOpen={showToastError}
            duration={1000}
            onDidDismiss={() => setShowToastError(false)}    //dopo 5 secondi si chiude e setta a false
            message="Connessione con il Database non riuscita. Riprova"
            position="bottom"
            color="danger"
          />    

          <IonToast //Chiamato quando ci sono campi non compilati
            isOpen={showToastEmptyField}
            duration={1000}
            onDidDismiss={() => setShowToastEmptyField(false)}    //dopo 5 secondi si chiude e setta a false
            message="E' necessario compilare tutti i campi con dei valori validi"
            position="bottom"
            color="danger"
          />      

            <IonItem>
              <IonLabel text-wrap >
              QR: {code}
              </IonLabel>  
              <IonButton onClick={() => checkPermission(0)} size="medium" expand="block" slot="end">
                 QR CODE SCAN
              </IonButton>
            </IonItem>
            
            <IonItem>
            <IonLabel text-wrap>
              Nuova quantità: {quantity}
            </IonLabel>
            <IonButton onClick={() => setShowAlertQuantity(true)} size="medium" expand="block" slot="end">
                 Inserisci quantità
              </IonButton>
            </IonItem>

            <IonItem>
              <IonLabel text-wrap>
              QR: {newCode}
              </IonLabel>  
              <IonButton onClick={() => {checkPermission(1)}} size="medium" expand="block" slot="end">
                 NEW QR CODE SCAN
              </IonButton>
            </IonItem>

            <IonItem>
            <IonLabel text-wrap>
              Quantità sottratta: {newQuantity}
            </IonLabel>
            <IonButton onClick={() => setShowAlertNewQuantity(true)} size="medium" expand="block" slot="end">
            Inserisci quantità
              </IonButton>
            </IonItem>

            <IonButton onClick={() =>{setCode("ciao"); setNewCode("ok"); setShowActionSheet(true)}} size="large" expand="block" color="success" >
                 Invio
            </IonButton>            
      </IonContent>
    </IonPage>
  )}
  else {return null;}
}

export default Pallets
