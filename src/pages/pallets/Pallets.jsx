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
  IonBackButton
} from '@ionic/react'
import React from 'react'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

import { url } from '../../config/config'



const Pallets = props => {

  //Visibility Variables
  const [hideHomePage, setHideHomePage] = React.useState(false) //vero= mostra fotocamera falso= mostra homepage
  const [showAlertQuantity, setShowAlertQuantity] = React.useState(false) //per inserire nuova quantità del pallets
  const [showAlertNewQuantity, setShowAlertNewQuantity] = React.useState(false) //per inserire quantità del nuovo pallets
  const [showToastSendButton, setShowToastSendButton] = React.useState(false) //barra sotto per invio
  const [showToastCancelButton, setShowToastCancelButton] = React.useState(false) //barra sotto per annulla
  const [showToastError, setShowToastError] = React.useState(false) //barra sotto per annulla
  const [showActionSheet, setShowActionSheet] = React.useState(false) //barra dopo premuto invio

  //Query Variables
  const [code, setCode] = React.useState()
  const [newCode, setNewCode] = React.useState()
  const [quantity, setQuantity] = React.useState()
  const [newQuantity, setNewQuantity] = React.useState()

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
    var data = {"qr" : "qqqqqqq", "nuova_qt":quantity,"nuovo_qr":"aaaa","qt_sottratta":newQuantity};
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
  setQuantity();
  setNewCode();
  setNewQuantity();
}
  catch(error){
    setShowToastError(true);
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
          cssClass='my-custom-class'
          header={'Inserisci nuova quantità'}
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
              handler: () => { setShowToastCancelButton(true)}
            }]}>
        </IonActionSheet>

        <IonToast
            isOpen={showToastSendButton}
            duration={2000}
            onDidDismiss={() => setShowToastSendButton(false)}    //dopo 2 secondi si chiude e setta a false
            message="Operazione completata"
            position="bottom"
            color="success"
          />
          <IonToast
            isOpen={showToastCancelButton}
            duration={2000}
            onDidDismiss={() => setShowToastCancelButton(false)}    //dopo 2 secondi si chiude e setta a false
            message="Operazione annullata"
            position="bottom"
            color="danger"
          />

          <IonToast
            isOpen={showToastError}
            duration={5000}
            onDidDismiss={() => setShowToastError(false)}    //dopo 5 secondi si chiude e setta a false
            message="Connessione con il Database non riuscita. Riprova"
            position="bottom"
            color="danger"
          />          

            <IonItem>
              <IonLabel >
              QR: {code}
              </IonLabel>  
              <IonButton onClick={() => checkPermission(0)} size="medium" expand="block" slot="end">
                 QR CODE SCAN
              </IonButton>
            </IonItem>
            
            <IonItem>
            <IonLabel>
              Nuova quantità: {quantity}
            </IonLabel>
            <IonButton onClick={() => setShowAlertQuantity(true)} size="medium" expand="block" slot="end">
                 Inserisci quantità
              </IonButton>
            </IonItem>

            <IonItem>
              <IonLabel>
              QR: {newCode}
              </IonLabel>  
              <IonButton onClick={() => {checkPermission(1)}} size="medium" expand="block" slot="end">
                 NEW QR CODE SCAN
              </IonButton>
            </IonItem>

            <IonItem>
            <IonLabel>
              Quantità sottratta: {newQuantity}
            </IonLabel>
            <IonButton onClick={() => setShowAlertNewQuantity(true)} size="medium" expand="block" slot="end">
            Inserisci quantità
              </IonButton>
            </IonItem>

            <IonButton onClick={() => setShowActionSheet(true)} size="large" expand="block" color="success" >
                 Invio
            </IonButton>            
      </IonContent>
    </IonPage>
  )}
  if(hideHomePage === true) {
    return(
     
      <IonHeader>
      <IonToolbar>
        <IonButton slot="end" >
          <IonBackButton text="Indietro" defaultHref="/" onClick={() => {BarcodeScanner.stopScan(); setHideHomePage(false)}}/>
       </IonButton>
      </IonToolbar>
    </IonHeader>
      
    )
  }
}

export default Pallets
