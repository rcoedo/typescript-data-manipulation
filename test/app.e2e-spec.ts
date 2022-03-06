import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CompanyController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    const req = await request(app.getHttpServer()).get('/stats');

    expect(req.statusCode).toEqual(200);
    expect(req.body).toMatchInlineSnapshot(`
      Object {
        "avgCharLengthPerMonth": Object {
          "01/2022": 386.93373493975906,
          "02/2022": 378.05479452054794,
          "03/2022": 365.6666666666667,
          "08/2021": 398.3333333333333,
          "09/2021": 371.8,
          "10/2021": 369.030487804878,
          "11/2021": 385.71069182389937,
          "12/2021": 415.6196319018405,
        },
        "avgNumberOfPostsPerUserPerMonth": Object {
          "01/2022": 8.3,
          "02/2022": 7.3,
          "03/2022": 1.95,
          "08/2021": 0.15,
          "09/2021": 8,
          "10/2021": 8.2,
          "11/2021": 7.95,
          "12/2021": 8.15,
        },
        "longestPostByCharLengthPerMonth": Object {
          "01/2022": Object {
            "created_time": "2022-01-25T04:44:35.000Z",
            "from_id": "user_7",
            "from_name": "Gigi Richter",
            "id": "post622749c4b9bcd_4312fece",
            "message": "cord cause vague stain manufacture vessel cheese essay cover wrestle virtue program wagon rage kidney missile reveal complication pavement safety egg white tie umbrella wagon executive effort swim literature contrary chaos chief tenant mirror definite ditch civilian delicate painter border corruption hiccup alcohol dawn candle bury dog allocation skeleton rocket accident thoughtful urine tap crude quotation point organize borrow tape make kill agreement trait pudding election contraction sailor pedestrian popular forward dominant reward truth skin relevance broadcast damage sun rally instal division name banana election fail environmental visible profit prediction hell wrestle feature troop stain veil sympathetic speech line glow stake",
            "type": "status",
          },
          "02/2022": Object {
            "created_time": "2022-02-08T15:46:09.000Z",
            "from_id": "user_15",
            "from_name": "Yolande Urrutia",
            "id": "post622749c4b98e0_a650df2b",
            "message": "mastermind body pump buy neighborhood pressure confront director kill retiree album railroad respectable critic revoke withdrawal ministry ankle circulation name Europe dawn meadow realize pick director master murder plant glare mail aluminium conception constitution kick assessment quotation omission neighborhood rhythm vague integrity realize chord dream leader dawn ban date mess reputation prosecute psychology turkey balance empirical paint difficulty visible border tolerate breast soap abuse language development avenue lamb trail twist safety program museum final future trick delay quest fashionable reliance constellation pit shy wagon crash provide prestige lot format recovery recording interference siege keep flourish night revoke animal credit card barrier",
            "type": "status",
          },
          "03/2022": Object {
            "created_time": "2022-03-02T23:06:18.000Z",
            "from_id": "user_4",
            "from_name": "Britany Heise",
            "id": "post622749c4b94c8_1eda8f3c",
            "message": "psychology reckless appear release dragon stand formula pudding shout falsify acquisition prevent veil pole treaty pest respectable pain corn series kidney withdrawal steward participate terrify sensation return director charter ban animal prize market boy angel spell abundant rally ethics suitcase trace transmission underline epicalyx lend instrument view torture attention discrimination producer embryo carve tribe snack variable merchant depression role correction survivor diplomat retired sample speed shy diameter beg duck prevent train condition establish body imperial dimension mother elephant shift approval establish accountant decorative proposal infrastructure favor population flow smash abstract snack missile scholar broadcast save ballot stereotype appetite",
            "type": "status",
          },
          "08/2021": Object {
            "created_time": "2021-08-31T19:20:27.000Z",
            "from_id": "user_13",
            "from_name": "Regenia Boice",
            "id": "post622749c4bb872_a60de6f4",
            "message": "norm advance audience pillow provide bend horseshoe shy glove lost rally cigarette thaw pole far housing mystery duck pressure raid horror formal reinforce sex rider parachute lake retiree tell useful flavor AIDS romantic trench Europe terminal extinct drum crusade excitement tenant discourage balance alcohol leaflet bill shell thinker audience tidy favourite prevalence sip death absorb bolt mug oak flu rob digital sulphur mug appear yard thumb clock opposition hostile quotation grudge room extend gain indoor opposition marriage",
            "type": "status",
          },
          "09/2021": Object {
            "created_time": "2021-09-25T14:00:33.000Z",
            "from_id": "user_7",
            "from_name": "Gigi Richter",
            "id": "post622749c4bb39f_aa1febf0",
            "message": "company friend paint fuel generate borrow organize quotation connection porter rubbish manage agreement arch pillow braid complex proposal prediction franchise district discourage story disk dream pudding producer try view sacrifice offense balance provide preparation stake grandmother pest hilarious litigation belief elite siege anger want policeman major railroad prescription brake audience press shift still deadly dimension dirty scratch invisible environmental platform night tune mild delay difficult stable trolley participate diplomat glow dimension meat aluminium date pursuit correction provide viable chord size balance acceptance mess fountain level multimedia diplomat stable trace information indication sniff evening bill part computer reinforce eyebrow skeleton escape",
            "type": "status",
          },
          "10/2021": Object {
            "created_time": "2021-10-11T19:10:51.000Z",
            "from_id": "user_10",
            "from_name": "Rafael Althoff",
            "id": "post622749c4bb0a2_112b5fe6",
            "message": "audience dirty graphic crew contrast empire genuine fight due wake keep policeman chief fountain address electronics element script find railroad electron beg sister permission kinship railroad abuse representative lie achievement hiccup representative coin elite steward preparation recording value trench knit survey margin tenant prosecute story information crash respectable deficiency sun snow stubborn national tendency freckle spell lost company television freckle yard advice initiative seed mold recording sweet constellation spot national wake wood permission dream consumption execute mayor formal hallway introduce bullet invisible shorts calculation closed division cope brick dream romantic prisoner check mold revoke meet section rough assessment snack tidy",
            "type": "status",
          },
          "11/2021": Object {
            "created_time": "2021-11-04T16:17:38.000Z",
            "from_id": "user_19",
            "from_name": "Quyen Pellegrini",
            "id": "post622749c4babfa_4459bced",
            "message": "suggest village use heaven angel corn wrestle folklore outfit appreciate thumb breast insert triangle offender inquiry falsify yard neighborhood presidency mine indulge factor crosswalk border education future wrist stress air dragon band hand candle nationalist fund jewel series appreciate dynamic spell host absent crosswalk scratch dragon precede constellation indication clock suitcase herb terminal barrier option racism excitement symptom rider pit check dragon draw tile begin tin state race lion debt depression escape scheme stain route occasion flow humanity straight bake linen flawed sympathetic penny short circuit intermediate glory opposition transmission ministry litigation sample resort retain drama golf judgment factor pick anger",
            "type": "status",
          },
          "12/2021": Object {
            "created_time": "2021-12-08T02:04:10.000Z",
            "from_id": "user_18",
            "from_name": "Ethelene Maggi",
            "id": "post622749c4ba57b_e98879b7",
            "message": "forward epicalyx swell skeleton drop rotation thaw disaster agriculture coalition contrast baby factor glove favor judge lot tap leaflet imperial baby direct breed drum church indication drop integration hell virgin use expertise banner building mastermind flawed salesperson thoughtful trait grandmother program reliance detective dramatic raid witness tick acquisition default fixture hole pressure extraterrestrial drill pain prediction need pot fist favourite wood fool beer retired fabricate coalition shorts computer presidency horseshoe depression delete church clearance trait ankle acceptance scandal coach pit pole accountant pest barrier neighborhood team ignite disk railroad avant-garde sister friend reinforce correction race excitement mathematics glow steward",
            "type": "status",
          },
        },
        "totalPostsByWeekNumber": Object {
          "2021-W35": 29,
          "2021-W36": 37,
          "2021-W37": 40,
          "2021-W38": 35,
          "2021-W39": 37,
          "2021-W40": 38,
          "2021-W41": 37,
          "2021-W42": 36,
          "2021-W43": 38,
          "2021-W44": 37,
          "2021-W45": 37,
          "2021-W46": 36,
          "2021-W47": 37,
          "2021-W48": 37,
          "2021-W49": 36,
          "2021-W50": 38,
          "2021-W51": 37,
          "2021-W52": 39,
          "2022-W01": 36,
          "2022-W02": 38,
          "2022-W03": 37,
          "2022-W04": 38,
          "2022-W05": 37,
          "2022-W06": 37,
          "2022-W07": 34,
          "2022-W08": 37,
          "2022-W09": 37,
          "2022-W10": 8,
        },
      }
    `);
  });
});
