sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "ns/projectf2/utils/services",
	"sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (oController, oServices, FilterOperator) {
        "use strict";

        return oController.extend("ns.projectf2.controller.View1", {
            onInit: function () {
                this.oServices = new oServices(this.getOwnerComponent());
                var response = this.oServices.getBooksData().then(res => {
                    return res;
                });

                response.then(res => {
                    this.createTable(res);
                })

                this.groupFunction = {
                    genre: function(oContext) {
                        var name = oContext.getProperty("genre");
                        return {
                            key: name,
                            text: name
                        };
                    },

                    originalLanguage: function(oContext) {
                        var language = oContext.getProperty("originalLanguage");
                        return {
                            key: language,
                            text: language,
                        }
                    }
                };
            },

            createTable: function(res) {
                this.oTableData = {
                    columns: [
                        {
                            name: "Id",
                            key: "id"
                        },
                        {
                            name: "Title",
                            key: "title"
                        },
                        {
                            name: "Author",
                            key: "author"
                        },
                        {
                            name: "Original language",
                            key: "originalLanguage"
                        },
                        {
                            name: "Genre",
                            key: "genre"
                        },
                        {
                            name: "Pusblish date",
                            key: "pusblishDate"
                        },
                        {
                            name: "Characters",
                            key: "characters"
                        }  
                    ],

                    rows: []
                }
                
                let aRows = res.map(oBooks => ({
                    id: oBooks.id,
                    title: oBooks.title,
                    author: oBooks.author,
                    originalLanguage: oBooks.originalLanguage,
                    genre: oBooks.genre,
                    pusblishDate: new Date(oBooks.pusblishDate),
                    characters: oBooks.characters
                }));

                this.oTableData.rows = aRows;

                this.byId("books-table").setModel(new sap.ui.model.json.JSONModel(this.oTableData));
            },

            onSortPress: function(e) {
                
                new sap.m.ViewSettingsDialog({
                    sortItems: [
                        new sap.m.ViewSettingsItem({
                            text: "Id",
                            key: "id"
                        }),
                        new sap.m.ViewSettingsItem({
                            text: "Title",
                            key: "title"
                        }),
                        new sap.m.ViewSettingsItem({
                            text: "Author",
                            key: "author"
                        }),
                        new sap.m.ViewSettingsItem({
                            text: "Original language",
                            key: "originalLanguage"
                        }),
                        new sap.m.ViewSettingsItem({
                            text: "Genre",
                            key: "genre"
                        }),
                        new sap.m.ViewSettingsItem({
                            text: "Pusblish date",
                            key: "pusblishDate"
                        })
                    ],
                    confirm: this.onSortConfirm.bind(this),
                    reset: this.resetDialog.bind(this)
                }).open();
            },

            onSortConfirm: function(e) {
                var params = e.getParameters();
                var key = params.sortItem.getKey();
                var order = params.sortDescending;
                var sorters = [];

                var table = this.byId("books-table");
                var items = table.getBinding("items");
                sorters.push(new sap.ui.model.Sorter(key,order));

                items.sort(sorters);
            },

            onGroupPress: function(e) {
                
                new sap.m.ViewSettingsDialog({
                    groupItems: [
                        new sap.m.ViewSettingsItem({
                            text: "Genre",
                            key: "genre",
                            selected: false
                        }),
                        new sap.m.ViewSettingsItem({
                            text: "Original language",
                            key: "originalLanguage",
                            selected: false
                        })
                    ],
                    confirm: this.onGroupConfirm.bind(this),
                    reset: this.resetDialog.bind(this)
                }).open();

            },

            resetDialog: function(e) {
                this.groupReset =  true;
            },

            onGroupConfirm: function(e) {
                var tabel = this.byId("books-table");
                var items = tabel.getBinding("items");
                var params = e.getParameters();
                var key;
                var order;
                var grouper;
                var groupers = [];

                if(params.groupItem) {
                    key = params.groupItem.getKey();
                    order = params.groupDescending;
                    grouper = this.groupFunction[key];
                    groupers.push(new sap.ui.model.Sorter(key, order, grouper));
                    items.sort(groupers);
                } 
                else if(this.groupReset) {
                    items.sort();
                    this.groupReset = false;
                }
            },

            onLiveSearch: function(e) {
                var aFilters = [];
                var query = e.getSource().getValue();
                if(query && query.length > 0) {
                    var filter = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter("title", FilterOperator.Contains, query),
                            new sap.ui.model.Filter("author", FilterOperator.Contains, query)
                        ]
                    });
                    aFilters.push(filter);
                }

                var table = this.byId("books-table");
                var items = table.getBinding("items");
                items.filter(aFilters);

            },

            onCreatePress: function(e) {
                var table = this.byId("books-table");
                var items = table.getBinding("items");
                var rows = items.oList;

                new sap.m.Dialog({
                   title: "Create",

                    content: [
                        new sap.m.VBox({
                            items: [
                                new sap.m.Label({
                                    text: "Id"
                                }),
                                new sap.m.Input(this.createId("idInput")),
                                new sap.m.Label({
                                    text: "Title"
                                }),
                                new sap.m.Input(this.createId("titleInput")),
                                new sap.m.Label({
                                    text: "Author"
                                }),
                                new sap.m.Input(this.createId("authorInput")),
                                new sap.m.Label({
                                    text: "Original language"
                                }),
                                new sap.m.Input(this.createId("originalLanguageInput")),
                                new sap.m.Label({
                                    text: "Genre"
                                }),
                                new sap.m.Input(this.createId("genreInput")),
                                new sap.m.Label({
                                    text: "Pusblish date"
                                }),
                                new sap.m.DatePicker(this.createId("pusblishDateInput")),
                                new sap.m.Label({
                                    text: "Characters"
                                }),
                                new sap.m.Input(this.createId("charactersInput")),
                            ]
                        })
                    ],

                    buttons: [
                        new sap.m.Button({
                            text: "Save",
                            press: (e) => {
                                this.onSavePress();
                                var dialog = e.getSource().getParent();
                                dialog.close();
                                dialog.destroyContent();
                            }
                        }),
                        new sap.m.Button({
                            text: "Close",
                            press: (e) => {
                                var dialog = e.getSource().getParent();
                                dialog.close();
                                dialog.destroyContent();
                            }
                        })
                    ]
                }).open();
            },

            onSavePress: function(e) {
                var inputId = this.byId("idInput").getValue();
                var inputTitle = this.byId("titleInput").getValue();
                var inputAuthor = this.byId("authorInput").getValue();
                var inputOriginalLanguage = this.byId("originalLanguageInput").getValue();
                var inputGenre = this.byId("genreInput").getValue();
                var inputPusblishDate = this.byId("pusblishDateInput").getValue();
                var inputCharacters = this.byId("charactersInput").getValue();

                var table = this.byId("books-table");
                var items = table.getBinding("items");
                var rows = items.oList;
                var newRow = {
                    id: inputId,
                    title: inputTitle,
                    author: inputAuthor,
                    originalLanguage: inputOriginalLanguage,
                    genre: inputGenre,
                    pusblishDate: inputPusblishDate,
                    characters: inputCharacters
                }

                rows.push(newRow);
                this.createTable(rows);           
            },

            onTableRowSelected: function(e){
                var {listItem} = e.getParameters();
                var data = listItem.getBindingContext().getObject();
                
                new sap.m.Dialog({
                    title: "Row selected",
                    content: [
                        new sap.m.VBox({
                            items: [
                                new sap.m.Text({
                                    text: `${data.title} ${data.author} ${data.originalLanguage} ${data.genre} ${data.pusblishDate} ${data.characters}`
                                })
                            ]
                        })
                    ],

                    buttons: [
                        new sap.m.Button({
                            text: "Edit",
                            press: (e) => {
                                this.onEditPress(data);
                                var dialog = e.getSource().getParent();
                                dialog.close();
                                dialog.destroyContent();
                            }
                        }),
                        new sap.m.Button({
                            text: "Delete",
                            press: (e) => {
                                this.onDeletePress(data);
                                var dialog = e.getSource().getParent();
                                dialog.close();
                                dialog.destroyContent();
                            }
                        }),
                        new sap.m.Button({
                            text: "Close",
                            press: (e) => {
                                var dialog = e.getSource().getParent();
                                dialog.close();
                                dialog.destroyContent();
                            }
                        })
                    ]
                }).open();
            },

            onEditPress: function(data) { 

                new sap.m.Dialog({
                    title: "Edit",
                    content: [
                        new sap.m.VBox({
                            items: [
                                new sap.m.Label({
                                    text: "Id"
                                }),
                                new sap.m.Input(this.createId("idInput"), {
                                    value: data.id
                                }),
                                new sap.m.Label({
                                    text: "Title"
                                }),
                                new sap.m.Input(this.createId("titleInput"), {
                                    value: data.title
                                }),
                                new sap.m.Label({
                                    text: "Author"
                                }),
                                new sap.m.Input(this.createId("authorInput"), {
                                    value: data.author
                                }),
                                new sap.m.Label({
                                    text: "Original language"
                                }),
                                new sap.m.Input(this.createId("originalLanguageInput"), {
                                    value: data.originalLanguage
                                }),
                                new sap.m.Label({
                                    text: "Genre"
                                }),
                                new sap.m.Input(this.createId("genreInput"), {
                                    value: data.genre
                                }),
                                new sap.m.Label({
                                    text: "Pusblish date"
                                }),
                                new sap.m.DatePicker(this.createId("pusblishDateInput"), {
                                    value: data.pusblishDate
                                }),
                                new sap.m.Label({
                                    text: "Characters"
                                }),
                                new sap.m.Input(this.createId("charactersInput"), {
                                    value: data.characters
                                })
                            ]
                        })
                    ],

                    buttons: [
                        new sap.m.Button({
                            text: "Update",
                            press: (e) => {
                                this.onUpdatePress(data);
                                var dialog = e.getSource().getParent();
                                dialog.close();
                                dialog.destroyContent();
                            }
                        }),
                        new sap.m.Button({
                            text: "Close",
                            press: (e) => {
                                var dialog = e.getSource().getParent();
                                dialog.close();
                                dialog.destroyContent();
                            }
                        })
                    ]
                }).open();
            },

            onUpdatePress: function(data) {
                var inputId = this.byId("idInput").getValue();
                var inputTitle = this.byId("titleInput").getValue();
                var inputAuthor = this.byId("authorInput").getValue();
                var inputOriginalLanguage = this.byId("originalLanguageInput").getValue();
                var inputGenre = this.byId("genreInput").getValue();
                var inputPusblishDate = this.byId("pusblishDateInput").getValue();
                var inputCharacters = this.byId("charactersInput").getValue();

                var table = this.byId("books-table");
                var items = table.getBinding("items");
                var rows = items.oList;
                
                for(let i = 0; i < rows.length; i++) {
                    if(rows[i].id == data.id){
                        rows[i] = {
                            id: parseInt(inputId),
                            title: inputTitle,
                            author: inputAuthor,
                            originalLanguage: inputOriginalLanguage,
                            genre: inputGenre, 
                            pusblishDate: inputPusblishDate,
                            characters: inputCharacters
                        }
                    }
                }
                this.createTable(rows);
            }, 

            onDeletePress: function(data) {
                var table = this.byId("books-table");
                var items = table.getBinding("items");
                var rows = items.oList;
                for(let i = 0; i < rows.length; i++) {
                    if(rows[i].id == data.id){
                        rows.splice(i, 1);
                        break;
                    }
                }
                this.createTable(rows);
            },

            onUserPress: function(e) {
                var email = new sap.ushell.services.UserInfo().getEmail();
                var user = new sap.ushell.services.UserInfo().getFullName();
                sap.m.MessageToast.show("Name: " + user + "\nEmail: " + email);
            }
        });
    }
);
