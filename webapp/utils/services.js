sap.ui.define(["sap/ui/base/Object", "ns/projectf2/utils/constants"], function(Object, Constants) {

    const BOOKS_API = "v1/16d1f456-0ed1-4601-8b12-08792688457e"
    const BOOKS = "Books"

    let oServices = Object.extend("ns.projectf2.utils.services", {
        constructor: function(ownerComponent) {
            this.BOOKS_URL = ownerComponent.getManifestEntry(Constants.BOOKS);
        }
    })

    oServices.prototype.getBooksData = async function() {
        let oBooksData = null;

        let oResponde = await fetch(`${this.BOOKS_URL}${BOOKS_API}`, {
            method: 'GET'
        });

        if(oResponde.ok) {
            oBooksData = await oResponde.json();
        }
        
        return oBooksData;
    }

    return oServices;
})