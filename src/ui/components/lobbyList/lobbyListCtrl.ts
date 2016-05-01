///<reference path="../../_app.ts" />
'use strict';

import "../../css/lobby-list.less";
import NetworkService from "../../services/networkService.ts";

interface LobbyListScope extends ng.IScope {
    networkService: NetworkService;
    username: string;
    
    join: (l: lobby.LobbyListItem) => void;
}

export default class LobbyListCtrl {
    static $inject = ["$scope", "$timeout", "$location", "networkService"];

    constructor($scope: LobbyListScope, $timeout: ng.ITimeoutService, $location: ng.ILocationService, network: NetworkService) {
        if (!network.currentConnection) {
            $location.path("/loading");
            return;
        }
        
        $scope.networkService = network;
        $scope.join = lobby => {
            network.joinLobby(lobby, $scope.username).then(ok => {
                console.log("Joined " + lobby.name);
                $timeout(() => $location.path("/lobby"));
            }, err => {
                console.log("Failed to join " + lobby.name);
                console.log(err.stack);
            });
        };
        
        // Update view on network updates.
        network.on("lobbylist-add", () => $scope.$apply());
        network.on("lobbylist-update", () => $scope.$apply());
        network.on("lobbylist-remove", () => $scope.$apply());
    }
}