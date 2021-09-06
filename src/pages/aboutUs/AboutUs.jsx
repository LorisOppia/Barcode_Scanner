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
  IonActionSheet,
  IonAlert,
} from '@ionic/react'
import React from 'react'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

const AboutUs = props => {
  const [codice, setCodice] = React.useState()
  const [codice_nuovo, setCodice_nuovo] = React.useState()
  const [nascondi, setNascondi] = React.useState(false)
  const [showAlert, setShowAlert] = React.useState(false)
  const [showAlert_nuovo, setShowModal_nuovo] = React.useState(false)

  //const [pulsante, setPulsante] = React.useState() 
  const [showToast_invio, setShowToast_invio] = React.useState(false)
  const [showToast_annulla, setShowToast_annulla] = React.useState(false)
  const [showActionSheet, setShowActionSheet] = React.useState(false)
  const [quantità, setQuantità] = React.useState()
  const [quantità_nuova, setQuantità_nuova] = React.useState()

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
                            }
  };

    if (nascondi === false){
    return (
    <IonPage>
    <IonToolbar>
        <IonTitle>Home page</IonTitle>
      </IonToolbar>
      <IonContent>

      <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
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
                setQuantità(parseInt(data.name))
              }
            }
          ]}
        />

        <IonAlert
          isOpen={showAlert_nuovo}
          onDidDismiss={() => setShowModal_nuovo(false)}
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
                setQuantità_nuova(parseInt(data.name))
              }
            }
          ]}
        />

        <IonActionSheet 
            isOpen={showActionSheet}
            onDidDismiss={() => setShowActionSheet(false)}
            header= {"Vuoi inviare " + quantità + " oggetti e " + quantità_nuova + " oggetti?"}
            buttons={[{
              text: 'Invio',
              handler: () => { setShowToast_invio(true)}
            },  {
              text: 'Annulla',
              handler: () => { setShowToast_annulla(true)}
            }]}>
        </IonActionSheet>

        <IonToast
            isOpen={showToast_invio}
            duration={2000}
            onDidDismiss={() => setShowToast_invio(false)}    //dopo 2 secondi si chiude e setta a false
            message="Operazione completata"
            position="bottom"
            color="success"
          />
          <IonToast
            isOpen={showToast_annulla}
            duration={2000}
            onDidDismiss={() => setShowToast_annulla(false)}    //dopo 2 secondi si chiude e setta a false
            message="Operazione annullata"
            position="bottom"
            color="danger"
          />
            <IonItem>
              <IonLabel >
              QR: {codice}
              </IonLabel>  
              <IonButton onClick={() => {checkPermission(0)}} size="medium" expand="block" slot="end">
                 QR CODE SCAN
              </IonButton>
            </IonItem>
            
            <IonItem>
            <IonLabel>
              Nuova quantità: {quantità}
            </IonLabel>
            <IonButton onClick={() => setShowAlert(true)} size="medium" expand="block" slot="end">
                 Inserisci quantità
              </IonButton>
            </IonItem>

            <IonItem>
              <IonLabel>
              QR: {codice_nuovo}
              </IonLabel>  
              <IonButton onClick={() => {checkPermission(1)}} size="medium" expand="block" slot="end">
                 NEW QR CODE SCAN
              </IonButton>
            </IonItem>

            <IonItem>
            <IonLabel>
              Quantità sottratta: {quantità_nuova}
            </IonLabel>
            <IonButton onClick={() => setShowModal_nuovo(true)} size="medium" expand="block" slot="end">
            Inserisci quantità
              </IonButton>
            </IonItem>

            <IonButton onClick={() => setShowActionSheet(true)} size="large" expand="block" color="success" >
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
