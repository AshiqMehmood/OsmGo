import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment.prod';
import { StatesService } from './states.service';
import { Platform } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';

export interface User {
    uid: string;
    display_name: string;
    connected: boolean;
    user: string;
    password: string;
}

export interface Changeset {
    id: string;
    last_changeset_activity: number;
    created_at: number;
    comment: string;
}

export interface Config {
    mapMarginBuffer: number,
    lockMapHeading: boolean,
    followPosition: boolean,
    defaultPrimarykeyWindows: 'lastTags' | 'bookmarks',
    baseMapSourceId: string,
    filterWayByArea: boolean,
    filterWayByLength: boolean,
    changeSetComment: string,
    languageUi: string,
    languageTags: string,
    countryTags: string,
    oldTagsIcon: { display: boolean, year: number },
    displayFixmeIcon: boolean,
    addSurveyDate: boolean,
    isDevMode: boolean,
    isDevServer: boolean,
    authType: 'basic' | 'oauth',
    checkedKey: 'survey:date' | 'check_date'
}

@Injectable({ providedIn: 'root' })
export class ConfigService {

    eventCloseGeolocPage = new EventEmitter();

    constructor(public localStorage: Storage,
        private platform: Platform,
        private http: HttpClient,
        private translate: TranslateService,
        public stateService: StatesService
    ) { }
    user_info: User = { uid: '', display_name: '', connected: false, user: null, password: null };
    changeset: Changeset = { id: '', last_changeset_activity: 0, created_at: 0, comment: '' };
    i18nConfig;

    eventConfigIsLoaded = new EventEmitter();
    freezeMapRenderer = false;
    platforms = [];
    deviceInfo;
    baseMapSources;
    currentZoom: number = undefined;



    defaultHiddenIds :string[] = [
        "highway/pedestrian_area",
        'highway/footway',
        'highway/motorway',
        'highway/trunk',
        'highway/trunk_link',
        'highway/primary',
        'highway/primary_link',
        'highway/secondary',
        'highway/secondary_link',
        'highway/tertiary',
        'highway/tertiary_link',
        'highway/unclassified',
        'highway/residential',
        'highway/service',
        'highway/motorway_link',
        'highway/living_street',
        'highway/track',
        'highway/bus_guideway',
        'highway/road',
        'highway/bridleway',
        'highway/path',
        'highway/cycleway',
        'highway/construction',
        'highway/steps',
        'highway/motorway_junction',
        'highway/corridor',
        'highway/pedestrian_line',
        'highway/cycleway/bicycle_foot',
        'highway/footway/crossing',
        'highway/service/parking_aisle',
        'highway/service/driveway',
        'highway/path/informal',
        'highway/stop',
        'highway/turning_circle',

        'barrier/hedge',
        'barrier/fence',
        'barrier/kerb',
        'barrier/wall',

        'natural/grassland',
        'natural/wood',
        'natural/bare_rock',
        'natural/cliff',
        'natural/shingle',
        'natural/coastline',

        'man_made/bridge',

        'building/train_station',
        'building/apartments',
        'building/barn',
        'building/boathouse',
        'building/bungalow',
        'building/cabin',
        'building/carport',
        "building/cathedral",
        "building/chapel",
        "building/church",
        "building/civic",
        "building/college",
        "building/commercial",
        "building/construction",
        "building/detached",
        "building/dormitory",
        "building/farm_auxiliary",
        "building/farm",
        "building/garage",
        "building/garages",
        "building/grandstand",
        "building/greenhouse",
        "building/hangar",
        "building/hospital",
        "building/hotel",
        "building/house",
        "building/houseboat",
        "building/hut",
        "building/industrial",
        "building/kindergarten",
        "building/mosque",
        "building/pavilion",
        "building/public",
        "building/residential",
        "building/retail",
        "building/roof",
        "building/ruins",
        "building/school",
        "building/semidetached_house",
        "building/service",
        "building/shed",
        "building/stable",
        "building/stadium",
        "building/static_caravan",
        "building/temple",
        "building/terrace",
        "building/transportation",
        "building/university",
        "building/warehouse",
        "building/office",
        "building/yes"
    ]


    config: Config = {
        mapMarginBuffer: 50,
        lockMapHeading: true,
        followPosition: true,
        defaultPrimarykeyWindows: 'lastTags',
        baseMapSourceId: this.baseMapSources ? this.baseMapSources[0].id : null,
        filterWayByArea: true,
        filterWayByLength: true,
        changeSetComment: '',
        languageUi: window.navigator.language.split('-')[0] || null,
        languageTags: window.navigator.language.split('-')[0] || null,
        countryTags: window.navigator.language && window.navigator.language.split('-')[1] ? window.navigator.language.split('-')[1].toUpperCase() : null,
        oldTagsIcon: { display: true, year: 4 },
        displayFixmeIcon: true,
        addSurveyDate: true,
        isDevMode: false,
        isDevServer: false,
        authType: this.platform.platforms().includes('hybrid') ? 'basic' : 'oauth',
        checkedKey: "survey:date"
    };

    currentTagsCountryChoice = [];


    geolocPageIsOpen = true;
    geojsonIsLoadedFromCache = false;

    init = {
        lng: 2.6,
        lat: 47,
        zoom: 4.8
    };

    appVersion = { appName: 'Osm Go!', appVersionCode: '12', appVersionNumber: environment.version || '0.0.0' };


    getUserInfo() {
        return this.user_info;
    }

    setUserInfo(_user_info) {
        this.user_info = _user_info;
        this.localStorage.set('user_info', this.user_info);
    }

    resetUserInfo() {
        this.user_info = { uid: '', display_name: '', connected: false, user: null, password: null };
        this.localStorage.set('user_info', this.user_info);
    }

    getChangeset(): Changeset {
        return this.changeset;
    }

    setChangeset(_id: string, _created_at, _last_changeset_activity, _comment) { // alimente changeset + localstorage
        this.changeset = {
            id: _id,
            last_changeset_activity: _last_changeset_activity,
            created_at: _created_at,
            comment: _comment
        };  // to do => ajouter le serveur?
        this.localStorage.set('changeset', this.changeset);
    }

    updateChangesetLastActivity() {
        const time = Date.now();
        this.changeset.last_changeset_activity = time;
        this.localStorage.set('last_changeset_activity', time.toString());
    }


    getI18nConfig$() {
        return this.http.get('./assets/i18n/i18n.json')
            .pipe(map(i18nConfig => {
                this.i18nConfig = i18nConfig;
                return i18nConfig
            }))

    }


    // TODO: add userInfo
    loadConfig$(_i18nConfig) {
        return from(this.localStorage.get('config'))
            .pipe(
                map(async d => {
                    if (d) {
                        // tslint:disable-next-line:forin
                        for (const key in d) {
                            this.config[key] = d[key];
                        }
                    } else {
                        this.localStorage.set('config', this.config);
                    }


                    this.config.languageTags = this.config.languageTags || 'en';
                    this.config.countryTags = this.config.countryTags || 'GB';


                    let userInfo = await this.localStorage.get('user_info')
                    if (userInfo && userInfo.connected) {
                        this.user_info = userInfo;
                    } else {
                        this.user_info = { uid: '', display_name: '', connected: false, user: null, password: null };
                    }

                    let changeset: Changeset = await this.localStorage.get('changeset')
                    if (changeset) {
                        this.changeset = changeset;
                    } else {
                        this.changeset = { id: '', last_changeset_activity: 0, created_at: 0, comment: this.getChangeSetComment() };
                    }
                    return { "config": this.config, "user_info": this.user_info, "changeset": this.changeset };
                })
            )
    }

    async loadAppVersion() {
        this.appVersion.appVersionNumber = environment.version;
        console.log(this.appVersion);

    }

    getAppVersion() {
        return this.appVersion;
    }


    setMapMarginBuffer(buffer: number) {
        this.config.mapMarginBuffer = buffer;
        this.localStorage.set('config', this.config);
    }
    getMapMarginBuffer() {
        return this.config.mapMarginBuffer;
    }

    setChangeSetComment(comment: string) {
        this.config.changeSetComment = comment;
        this.localStorage.set('config', this.config);
    }
    getChangeSetComment() {
        return this.config.changeSetComment;
    }

    setLockMapHeading(isLockMapHeading: boolean) {
        this.config.lockMapHeading = isLockMapHeading;
        this.localStorage.set('config', this.config);
    }
    getLockMapHeading() {
        return this.config.lockMapHeading;
    }


    setFollowPosition(isFollowingPosition: boolean) {
        this.config.followPosition = isFollowingPosition;
        this.localStorage.set('config', this.config);
    }
    getFollowPosition() {
        return this.config.followPosition;
    }

    setDefaultPrimarykeyWindows(defaultPrimarykeyWindows: 'lastTags' | 'bookmarks') {
        this.config.defaultPrimarykeyWindows = defaultPrimarykeyWindows;
        this.localStorage.set('config', this.config);
    }

    getDefaultPrimarykeyWindows() {
        return this.config.defaultPrimarykeyWindows;
    }

    setBaseSourceId(baseMapSourceId: string) {
        this.config.baseMapSourceId = baseMapSourceId;
        this.localStorage.set('config', this.config);
    }

    getBaseMapId() {
        return this.config.baseMapSourceId;
    }

    /* Boolean, activé ou pas */
    setFilterWayByArea(enable: boolean) {
        this.config.filterWayByArea = enable;
        this.localStorage.set('config', this.config);
    }
    getFilterWayByArea() {
        return this.config.filterWayByArea;
    }

    setFilterWayByLength(enable: boolean) {
        this.config.filterWayByLength = enable;
        this.localStorage.set('config', this.config);
    }

    getFilterWayByLength() {
        return this.config.filterWayByLength;
    }

    setUiLanguage(lang: string) {
        this.config.languageUi = lang;
        this.translate.use(lang);
        this.localStorage.set('config', this.config);
    }

    getUiLanguage() {
        return this.config.languageUi;
    }

    setLanguageTags(lang: string) {
        this.config.languageTags = lang;
        // this.currentTagsCountryChoice = this.i18nConfig.tags.find(l => l.language == lang).country;
        // this.config.countryTags = this.currentTagsCountryChoice[0].region;
        this.localStorage.set('config', this.config);
    }

    setCountryTags(country: string) {
        this.config.countryTags = country;
        this.localStorage.set('config', this.config);
    }

    getOldTagsIcon() {
        return this.config.oldTagsIcon;
    }

    setOldTagsIcon(display: boolean, year: number) {
        this.config.oldTagsIcon = { display: display, year: year }
        this.localStorage.set('config', this.config);
    }

    getDisplayFixmeIcon() {
        return this.config.displayFixmeIcon;
    }

    setDisplayFixmeIcon(display: boolean) {
        this.config.displayFixmeIcon = display
        this.localStorage.set('config', this.config);
    }

    getAddSurveyDate() {
        return this.config.addSurveyDate;
    }

    setAddSurveyDate(add: boolean) {
        this.config.addSurveyDate = add
        this.localStorage.set('config', this.config);
    }

    getCheckedKey() : 'survey:date' | 'check_date'  {
        return this.config.checkedKey;
    }

    setCheckedKey(key: 'survey:date' | 'check_date') {
        this.config.checkedKey = key
        this.localStorage.set('config', this.config);
    }


    getIsDevMode() {
        return this.config.isDevMode;
    }

    setIsDevMode(isDevMode: boolean) {
        this.config.isDevMode = isDevMode;
        this.localStorage.set('config', this.config);
    }

    getIsDevServer() {
        return this.config.isDevServer;
    }

    async setIsDevServer(isDevServer: boolean) {
        this.config.isDevServer = isDevServer;
        await this.localStorage.set('config', this.config);
        await this.localStorage.remove('geojson');
        await this.localStorage.remove('geojsonBbox');
        await this.localStorage.remove('user_info');
        await this.localStorage.remove('geojsonChanged');
        return isDevServer;
    }

}
