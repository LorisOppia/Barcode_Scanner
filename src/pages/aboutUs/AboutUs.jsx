import {
  IonContent,
  IonPage,
  IonButton,
  IonToolbar,
  IonTitle,
  IonModal,
  IonToast,
  IonInput,
  IonLabel,
} from '@ionic/react'
import React from 'react'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

const AboutUs = props => {
  const [codice, setCodice] = React.useState(0)
  const [nascondi, setNascondi] = React.useState(false)
  const [showModal, setShowModal] = React.useState(false)
  const [showToast, setShowToast] = React.useState(false)
  const [quantità, setQuantità] = React.useState(0)

  const checkPermission = async () => {
    const status = await BarcodeScanner.checkPermission({ force: true });     //chiede permesso fotocamera
    if (status.granted) { startScan() }
    };

  const startScan = async () => {
    setNascondi(true)    //fa vedere la fotocamera
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {setCodice(result.content);
                            setNascondi(false);   //fa vedere la pagina
                            setShowModal(true);   //fa vedere il modal
                            }
  };

  let url = "http://localhost:8000/admin/login/?next=/admin/"
  //let url1 = "https://dog.ceo/api/breeds/image/random"
  let aut = 'admin:password'
  const getData = async () => {
      const data = await fetch(url,{
        credentials: 'same-origin',
        headers: {
          'authorization': 'Basic '+ aut.toString('base64'),
        }
      })
      const datajson = await data.text()
      console.log(datajson)       
  };

    if (nascondi === false){
    return (
    <IonPage>
    <IonToolbar>
        <IonTitle>Home page</IonTitle>
      </IonToolbar>
      <IonContent>

        <IonModal isOpen={showModal}>
            <IonLabel>Codice rilevato: {codice}</IonLabel>
            <IonInput onIonChange={e => setQuantità(parseInt(e.detail.value))} type="number" placeholder="Inserisci la quantità" ></IonInput>
            <IonButton onClick={() => {setShowModal(false);   //nasconde il modal
                                       setShowToast(true)     //mostra il toast
                                       }
                                }>
                 Aggiungi
            </IonButton>
        </IonModal>

        <IonToast
            isOpen={showToast}
            duration={3000}
            onDidDismiss={() => setShowToast(false)}    //dopo 2 secondi si chiude e setta a false
            message={"Hai aggiunto " + quantità + " oggetti"}
            position="bottom"
            color="success"
          />
            <IonButton onClick={checkPermission} size="large" expand="block" >
                 Aggiungi quantità
            </IonButton>

            <IonButton onClick={checkPermission} size="large" expand="block" color="danger">
                Sottrai quantità
            </IonButton>

            <IonButton onClick={checkPermission} size="large" expand="block" color="success">
                 Nuovo codice
            </IonButton>

            <IonButton onClick={() => setShowModal(true)} size="large" expand="block" color="warning" >
                 Elimina codice
            </IonButton>

            <IonButton onClick={getData} size="large" expand="block" color="medium" >
                 Inventario
            </IonButton>            
      </IonContent>
    </IonPage>
  )}
  else {
    return(
      null
    )
  }
}

export default AboutUs
