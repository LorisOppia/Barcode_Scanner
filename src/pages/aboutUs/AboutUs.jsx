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
  IonItem,
  IonText,
} from '@ionic/react'
import React from 'react'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

const AboutUs = props => {
  const [codice, setCodice] = React.useState()
  const [codice_nuovo, setCodice_nuovo] = React.useState()
  const [nascondi, setNascondi] = React.useState(false)
  const [showModal, setShowModal] = React.useState(false)
  const [showToast, setShowToast] = React.useState(false)
  const [quantità, setQuantità] = React.useState(0)

  const checkPermission = async (pulsante) => {
    const status = await BarcodeScanner.checkPermission({ force: true });     //chiede permesso fotocamera
    if (status.granted) { startScan(pulsante) }
    };

  const startScan = async (pulsante) => {
    setNascondi(true)    //fa vedere la fotocamera
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {if (pulsante===0) {setCodice(result.content);}
                            if (pulsante===1) {setCodice_nuovo(result.content);}
                            setNascondi(false);   //fa vedere la pagina
                            //setShowModal(true);   //fa vedere il modal
                            }
  };

  let url = "http://127.0.0.1:8000"
  /*let aut = 'admin:password'
  const getData = async () => {
      const data = await fetch(url,{
        credentials: 'same-origin',
        headers: {
          'authorization': 'Basic '+ aut.toString('base64'),
        }
      })
      const datajson = await data.json()
      console.log(datajson)       
  };*/

  const GetPallets  = async () =>{ fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
            },
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data)
    })
    .catch(error => {
      console.error('Error:', error)
    })
    return;
  }

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
            <IonItem>
              <IonText position="floating">
              QR: {codice}
              </IonText>  
              <IonButton onClick={() => {checkPermission(0)}} size="medium" expand="block" slot="end">
                 QR CODE SCAN
              </IonButton>
            </IonItem>
            
            <IonItem>
            <IonLabel position="floating">
              Nuova quantità
            </IonLabel>
            <IonInput onIonChange={e => setQuantità(parseInt(e.detail.value))} type="number" placeholder="Inserisci la quantità" ></IonInput>
            </IonItem>


            <IonItem>
              <IonText position="floating">
              QR: {codice_nuovo}
              </IonText>  
              <IonButton onClick={() => {checkPermission(1)}} size="medium" expand="block" slot="end">
                 NEW QR CODE SCAN
              </IonButton>
            </IonItem>

            <IonItem>
            <IonLabel position="floating">
              Quantità sottratta
            </IonLabel>
            <IonInput onIonChange={e => setQuantità(parseInt(e.detail.value))} type="number" placeholder="Inserisci la quantità" ></IonInput>
            </IonItem>

            <IonButton onClick={null} size="large" expand="block" color="success" >
                 Invio
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
