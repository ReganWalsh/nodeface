import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mimeType = (
  control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof(control.value) === 'string') {
    return of(null);
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  const fileReaderObservable = Observable.create((observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener("loadend", () => {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        let header = "";
        let isValid = false;
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        switch (header) {
          case "89504e47": //Associates With A File Type
            isValid = true;
            break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            isValid = true;
            break;
          default:
            isValid = false; //Otherwise Not Valid
            break;
        }
        if (isValid) {
          observer.next(null); //If Image Is Valid, Observer Has Nothing Else To Do
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete(); //End Observer
      });
      fileReader.readAsArrayBuffer(file); //Read The File
    }
  );
  return fileReaderObservable;
};
