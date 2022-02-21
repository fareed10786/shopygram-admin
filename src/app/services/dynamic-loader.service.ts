import { Injectable } from '@angular/core';
interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  { name: 'chartjs', src: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js' },
  { name:'jquery',src:'../../assets/js/jquery.min.js'},
  { name:'popper',src:'../../assets/js/popper.min.js'},
  { name:'bootstrap',src:'../../assets/js/bootstrap.min.js'},
  { name:'bundle',src:'../../assets/js/bundle.js'},
  { name:'fullscreen',src:'../../assets/js/default-assets/fullscreen.js'},

  { name:'canvas',src:'../../assets/js/canvas.js'},
  { name:'collapse',src:'../../assets/js/collapse.js'},
  { name:'settings',src:'../../assets/js/settings.js'},
  { name:'template',src:'../../assets/js/template.js'},
  { name:'active',src:'../../assets/js/default-assets/active.js'},

  { name:'mini-event-calendar',src:'../../assets/js/default-assets/mini-event-calendar.min.js'},
  { name:'mini-calendar-active',src:'../../assets/js/default-assets/mini-calendar-active.js'},
  { name:'apexchart.min.js',src:'../../assets/js/default-assets/apexchart.min.js'},
  { name:'dashboard-active',src:'../../assets/js/default-assets/dashboard-active.js'},
  { name:'jquery.datatables.min',src:'../../assets/js/default-assets/jquery.datatables.min.js'},
  { name:'datatables.bootstrap4',src:'../../assets/js/default-assets/datatables.bootstrap4.js'},
  { name:'datatable-responsive.min',src:'../../assets/js/default-assets/datatable-responsive.min.js'},
  { name:'responsive.bootstrap4.min',src:'../../assets/js/default-assets/responsive.bootstrap4.min.js'},
  { name:'datatable-button.min',src:'../../assets/js/default-assets/datatable-button.min.js'},
  { name:'button.bootstrap4.min',src:'../../assets/js/default-assets/button.bootstrap4.min.js'},
  { name:'button.html5.min',src:'../../assets/js/default-assets/button.html5.min.js'},
  { name:'button.flash.min',src:'../../assets/js/default-assets/button.flash.min.js'},
  { name:'button.print.min',src:'../../assets/js/default-assets/button.print.min.js'},
  { name:'datatables.keytable.min',src:'../../assets/js/default-assets/datatables.keytable.min.js'},
  { name:'datatables.select.min',src:'../../assets/js/default-assets/datatables.select.min.js'},
  { name:'demo.datatable-init',src:'../../assets/js/default-assets/demo.datatable-init.js'}
];

declare var document: any;

@Injectable({
  providedIn: 'root'
})
export class DynamicScriptLoaderService {

  private scripts: any = {};

  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  load() {
    const promises: any[] = [];
    ScriptStore.forEach((script) => promises.push(this.loadScript(script.name)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      if (!this.scripts[name].loaded) {
        //load script
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {  //IE
            script.onreadystatechange = () => {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    this.scripts[name].loaded = true;
                    resolve({script: name, loaded: true, status: 'Loaded'});
                }
            };
        } else {  //Others
            script.onload = () => {
                this.scripts[name].loaded = true;
                resolve({script: name, loaded: true, status: 'Loaded'});
            };
        }
        script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      }
    });
  }

}