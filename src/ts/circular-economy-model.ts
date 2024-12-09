// This file was auto-generated from the InsightMaker model. Do not edit it manually.
import type {
  ModelElementObject,
  ModelElementId,
  ModelElementArray,
  ModelRecord,
} from './model';

import { Model } from './model';

const stockIds = [
  'capacityOfNaturalResources',
  'capacityOfNewlyProducedPhones',
  'capacityOfPhonesInUse',
  'capacityOfRecycledMaterials',
  'capacityOfRefurbishedPhones',
  'capacityOfRepairedPhones',
  'phonesInUse',
  'supplyOfBrokenPhones',
  'supplyOfDisposedPhones',
  'supplyOfHibernatingPhones',
  'supplyOfNaturalResources',
  'supplyOfNewlyProducedPhones',
  'supplyOfRecycledMaterials',
  'supplyOfRefurbishedPhones',
  'supplyOfRepairedPhones',
] as const;

const flowIds = [
  'abandon',
  'acquireNewlyProduced',
  'acquireRefurbished',
  'acquireRepaired',
  'acquireUsed',
  'capacityOfNaturalResourcesAdjustment',
  'capacityOfNewlyProducedPhonesAdjustment',
  'capacityOfPhonesInUseAdjustment',
  'capacityOfRecycledMaterialsAdjustment',
  'capacityOfRefurbishedPhonesAdjustment',
  'disposeBroken',
  'disposeHibernating',
  'goBroken',
  'landfill',
  'mineNaturalResources',
  'produceFromNaturalResources',
  'produceFromRecycledMaterials',
  'recycle',
  'refurbish',
  'repair',
  'repairShopCapcityAdjustment',
] as const;

const variableIds = [
  'circularityScore',
  'coverageScore',
  'demandForMining',
  'demandForNaturalResources',
  'demandForNewlyProducedPhones',
  'demandForPhones',
  'demandForRecycledMaterials',
  'demandForRecycling',
  'demandForRefurbishedPhones',
  'demandForRefurbishment',
  'demandForRepair',
  'demandForRepairedPhones',
  'demandForResources',
  'demandForReusedPhones',
  'inflowIncentiveSumForPhonesInUse',
  'phoneGoal',
  'phonesInUseExcess',
  'supplyOfBrokenPhonesForDisposal',
  'supplyOfBrokenPhonesForRepair',
  'supplyOfDisposedPhonesForLandfilling',
  'supplyOfDisposedPhonesForRecycling',
  'supplyOfHibernatingPhonesForDisposal',
  'supplyOfHibernatingPhonesForRefurbishment',
  'supplyOfHibernatingPhonesForReuse',
  'weightedSumOfBadFlows',
  'weightedSumOfGoodFlows',
] as const;

const parameterIds = [
  'abandonExcessRate',
  'abandonRate',
  'acquireRate',
  'breakRate',
  'capacityAdjustmentRate',
  'disposeIncentive',
  'disposeRate',
  'landfillIncentive',
  'landfillRate',
  'naturalResourceMiningRate',
  'naturalResourcesIncentive',
  'newPhoneProductionRate',
  'newlyProducedPhoneIncentive',
  'numberOfUsers',
  'phonesPerUserGoal',
  'recycleRate',
  'recyclingIncentive',
  'refurbishmentIncentive',
  'refurbishmentRate',
  'repairIncentive',
  'repairRate',
  'reuseIncentive',
  'userdata',
] as const;

type StockIds = typeof stockIds;
type StockId = ModelElementId<StockIds>;
type Stocks = ModelElementObject<StockIds>;
type StockArray = ModelElementArray<StockIds>;

type FlowIds = typeof flowIds;
type FlowId = ModelElementId<FlowIds>;
type Flows = ModelElementObject<FlowIds>;
type FlowArray = ModelElementArray<FlowIds>;

type VariableIds = typeof variableIds;
type VariableId = ModelElementId<VariableIds>;
type Variables = ModelElementObject<VariableIds>;
type VariableArray = ModelElementArray<VariableIds>;

type ParameterIds = typeof parameterIds;
type ParameterId = ModelElementId<ParameterIds>;
type Parameters = ModelElementObject<ParameterIds>;
type ParameterArray = ModelElementArray<ParameterIds>;

type Record = ModelRecord<StockIds, FlowIds, VariableIds, ParameterIds>;

class CircularEconomyModel extends Model<
  StockIds,
  FlowIds,
  VariableIds,
  ParameterIds
> {
  public static readonly initialStocks: Readonly<Stocks> = {
    capacityOfNaturalResources: 0,
    capacityOfNewlyProducedPhones: 0,
    capacityOfPhonesInUse: 0,
    capacityOfRecycledMaterials: 0,
    capacityOfRefurbishedPhones: 0,
    capacityOfRepairedPhones: 0,
    phonesInUse: 0,
    supplyOfBrokenPhones: 0,
    supplyOfDisposedPhones: 0,
    supplyOfHibernatingPhones: 0,
    supplyOfNaturalResources: 0,
    supplyOfNewlyProducedPhones: 0,
    supplyOfRecycledMaterials: 0,
    supplyOfRefurbishedPhones: 0,
    supplyOfRepairedPhones: 0,
  };

  public static readonly defaultParameters: Readonly<Parameters> = {
    abandonExcessRate: 0.5,
    abandonRate: 0.1,
    acquireRate: 1,
    breakRate: 0.1,
    capacityAdjustmentRate: 0.1,
    disposeIncentive: 0.5,
    disposeRate: 0.5,
    landfillIncentive: 0.5,
    landfillRate: 1,
    naturalResourceMiningRate: 0.5,
    naturalResourcesIncentive: 0.5,
    newPhoneProductionRate: 0.5,
    newlyProducedPhoneIncentive: 0.82,
    numberOfUsers: 1000000,
    phonesPerUserGoal: 1,
    recycleRate: 1,
    recyclingIncentive: 0.89,
    refurbishmentIncentive: 0.5,
    refurbishmentRate: 1,
    repairIncentive: 0.5,
    repairRate: 1,
    reuseIncentive: 0.86,
    userdata: 0,
  };

  constructor() {
    super(stockIds, flowIds, variableIds, parameterIds);
  }

  // eslint-disable-next-line class-methods-use-this
  public evaluate(stocks: Stocks, parameters: Parameters, t: number): Record {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      capacityOfNaturalResources,
      capacityOfNewlyProducedPhones,
      capacityOfPhonesInUse,
      capacityOfRecycledMaterials,
      capacityOfRefurbishedPhones,
      capacityOfRepairedPhones,
      phonesInUse,
      supplyOfBrokenPhones,
      supplyOfDisposedPhones,
      supplyOfHibernatingPhones,
      supplyOfNaturalResources,
      supplyOfNewlyProducedPhones,
      supplyOfRecycledMaterials,
      supplyOfRefurbishedPhones,
      supplyOfRepairedPhones,
    } = stocks;
    const {
      abandonExcessRate,
      abandonRate,
      acquireRate,
      breakRate,
      capacityAdjustmentRate,
      disposeIncentive,
      disposeRate,
      landfillIncentive,
      landfillRate,
      naturalResourceMiningRate,
      naturalResourcesIncentive,
      newPhoneProductionRate,
      newlyProducedPhoneIncentive,
      numberOfUsers,
      phonesPerUserGoal,
      recycleRate,
      recyclingIncentive,
      refurbishmentIncentive,
      refurbishmentRate,
      repairIncentive,
      repairRate,
      reuseIncentive,
      userdata,
    } = parameters;

    const phoneGoal = numberOfUsers * phonesPerUserGoal;
    const phonesInUseExcess = Math.max(phonesInUse - phoneGoal, 0);
    const abandon =
      abandonRate * phonesInUse + abandonExcessRate * phonesInUseExcess;
    const goBroken = breakRate * phonesInUse;
    const demandForPhones = Math.min(
      Math.max(0, capacityOfPhonesInUse - phonesInUse + goBroken + abandon),
      phoneGoal,
    );
    const acquireNewlyProduced =
      acquireRate * Math.min(supplyOfNewlyProducedPhones, demandForPhones);
    const acquireRefurbished =
      acquireRate * Math.min(demandForPhones, supplyOfRefurbishedPhones);
    const acquireRepaired =
      acquireRate * Math.min(demandForPhones, supplyOfRepairedPhones);
    const supplyOfHibernatingPhonesForReuse =
      (reuseIncentive /
        (reuseIncentive + refurbishmentIncentive + disposeIncentive)) *
      supplyOfHibernatingPhones;
    const acquireUsed =
      acquireRate *
      Math.min(supplyOfHibernatingPhonesForReuse, demandForPhones);
    const demandForResources = Math.max(
      capacityOfNewlyProducedPhones -
        supplyOfNewlyProducedPhones +
        acquireNewlyProduced,
      0,
    );
    const demandForNaturalResources =
      (naturalResourcesIncentive /
        (naturalResourcesIncentive + recyclingIncentive)) *
      demandForResources;
    const capacityOfNaturalResourcesAdjustment =
      capacityAdjustmentRate *
      (demandForNaturalResources - capacityOfNaturalResources);
    const inflowIncentiveSumForPhonesInUse =
      reuseIncentive +
      repairIncentive +
      refurbishmentIncentive +
      newlyProducedPhoneIncentive;
    const demandForNewlyProducedPhones =
      (newlyProducedPhoneIncentive / inflowIncentiveSumForPhonesInUse) *
      demandForPhones;
    const capacityOfNewlyProducedPhonesAdjustment =
      capacityAdjustmentRate *
      (demandForNewlyProducedPhones - capacityOfNewlyProducedPhones);
    const capacityOfPhonesInUseAdjustment =
      capacityAdjustmentRate * (phoneGoal - capacityOfPhonesInUse);
    const demandForRecycledMaterials =
      (recyclingIncentive / (naturalResourcesIncentive + recyclingIncentive)) *
      demandForResources;
    const capacityOfRecycledMaterialsAdjustment =
      capacityAdjustmentRate *
      (demandForRecycledMaterials - capacityOfRecycledMaterials);
    const demandForRefurbishedPhones =
      (refurbishmentIncentive / inflowIncentiveSumForPhonesInUse) *
      demandForPhones;
    const capacityOfRefurbishedPhonesAdjustment =
      capacityAdjustmentRate *
      (demandForRefurbishedPhones - capacityOfRefurbishedPhones);
    const supplyOfBrokenPhonesForDisposal =
      (disposeIncentive / (repairIncentive + disposeIncentive)) *
      supplyOfBrokenPhones;
    const disposeBroken = disposeRate * supplyOfBrokenPhonesForDisposal;
    const supplyOfHibernatingPhonesForDisposal =
      (disposeIncentive /
        (reuseIncentive + refurbishmentIncentive + disposeIncentive)) *
      supplyOfHibernatingPhones;
    const disposeHibernating =
      disposeRate * supplyOfHibernatingPhonesForDisposal;
    const supplyOfDisposedPhonesForLandfilling =
      (landfillIncentive / (recyclingIncentive + landfillIncentive)) *
      supplyOfDisposedPhones;
    const landfill = landfillRate * supplyOfDisposedPhonesForLandfilling;
    const produceFromNaturalResources =
      newPhoneProductionRate *
      Math.min(supplyOfNaturalResources, demandForResources);
    const demandForMining = Math.max(
      capacityOfNaturalResources -
        supplyOfNaturalResources +
        produceFromNaturalResources,
      0,
    );
    const mineNaturalResources = naturalResourceMiningRate * demandForMining;
    const produceFromRecycledMaterials =
      newPhoneProductionRate *
      Math.min(demandForResources, supplyOfRecycledMaterials);
    const supplyOfDisposedPhonesForRecycling =
      (recyclingIncentive / (recyclingIncentive + landfillIncentive)) *
      supplyOfDisposedPhones;
    const demandForRecycling = Math.max(
      capacityOfRecycledMaterials -
        supplyOfRecycledMaterials +
        produceFromRecycledMaterials,
      0,
    );
    const recycle =
      recycleRate *
      Math.min(supplyOfDisposedPhonesForRecycling, demandForRecycling);
    const supplyOfHibernatingPhonesForRefurbishment =
      (refurbishmentIncentive /
        (reuseIncentive + refurbishmentIncentive + disposeIncentive)) *
      supplyOfHibernatingPhones;
    const demandForRefurbishment = Math.max(
      capacityOfRefurbishedPhones -
        supplyOfRefurbishedPhones +
        acquireRefurbished,
      0,
    );
    const refurbish =
      refurbishmentRate *
      Math.min(
        supplyOfHibernatingPhonesForRefurbishment,
        demandForRefurbishment,
      );
    const supplyOfBrokenPhonesForRepair =
      (repairIncentive / (repairIncentive + disposeIncentive)) *
      supplyOfBrokenPhones;
    const demandForRepair = Math.max(
      capacityOfRepairedPhones - supplyOfRepairedPhones + acquireRepaired,
      0,
    );
    const repair =
      repairRate * Math.min(supplyOfBrokenPhonesForRepair, demandForRepair);
    const demandForRepairedPhones =
      (repairIncentive / inflowIncentiveSumForPhonesInUse) * demandForPhones;
    const repairShopCapcityAdjustment =
      capacityAdjustmentRate *
      (demandForRepairedPhones - capacityOfRepairedPhones);
    const weightedSumOfGoodFlows =
      acquireUsed +
      (repair + acquireRepaired) / 2 +
      (refurbish + acquireRepaired) / 2 +
      (recycle + produceFromRecycledMaterials) / 2;
    const weightedSumOfBadFlows = (produceFromNaturalResources + landfill) / 2;
    const circularityScore = Math.max(
      Math.min(
        weightedSumOfGoodFlows /
          (Math.abs(weightedSumOfGoodFlows + weightedSumOfBadFlows) +
            2.220446049250313e-16),
        1,
      ),
      0,
    );
    const coverageScore = phonesInUse / phoneGoal;
    const demandForReusedPhones =
      (reuseIncentive / inflowIncentiveSumForPhonesInUse) * demandForPhones;

    const variables = {
      circularityScore,
      coverageScore,
      demandForMining,
      demandForNaturalResources,
      demandForNewlyProducedPhones,
      demandForPhones,
      demandForRecycledMaterials,
      demandForRecycling,
      demandForRefurbishedPhones,
      demandForRefurbishment,
      demandForRepair,
      demandForRepairedPhones,
      demandForResources,
      demandForReusedPhones,
      inflowIncentiveSumForPhonesInUse,
      phoneGoal,
      phonesInUseExcess,
      supplyOfBrokenPhonesForDisposal,
      supplyOfBrokenPhonesForRepair,
      supplyOfDisposedPhonesForLandfilling,
      supplyOfDisposedPhonesForRecycling,
      supplyOfHibernatingPhonesForDisposal,
      supplyOfHibernatingPhonesForRefurbishment,
      supplyOfHibernatingPhonesForReuse,
      weightedSumOfBadFlows,
      weightedSumOfGoodFlows,
    };
    const flows = {
      abandon,
      acquireNewlyProduced,
      acquireRefurbished,
      acquireRepaired,
      acquireUsed,
      capacityOfNaturalResourcesAdjustment,
      capacityOfNewlyProducedPhonesAdjustment,
      capacityOfPhonesInUseAdjustment,
      capacityOfRecycledMaterialsAdjustment,
      capacityOfRefurbishedPhonesAdjustment,
      disposeBroken,
      disposeHibernating,
      goBroken,
      landfill,
      mineNaturalResources,
      produceFromNaturalResources,
      produceFromRecycledMaterials,
      recycle,
      refurbish,
      repair,
      repairShopCapcityAdjustment,
    };

    return { t, stocks, parameters, variables, flows };
  }

  // eslint-disable-next-line class-methods-use-this
  public accumulateFlowsPerStock(flows: Flows): Stocks {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      abandon,
      acquireNewlyProduced,
      acquireRefurbished,
      acquireRepaired,
      acquireUsed,
      capacityOfNaturalResourcesAdjustment,
      capacityOfNewlyProducedPhonesAdjustment,
      capacityOfPhonesInUseAdjustment,
      capacityOfRecycledMaterialsAdjustment,
      capacityOfRefurbishedPhonesAdjustment,
      disposeBroken,
      disposeHibernating,
      goBroken,
      landfill,
      mineNaturalResources,
      produceFromNaturalResources,
      produceFromRecycledMaterials,
      recycle,
      refurbish,
      repair,
      repairShopCapcityAdjustment,
    } = flows;

    const flowPerStock: Stocks = {
      capacityOfNaturalResources: capacityOfNaturalResourcesAdjustment,
      capacityOfNewlyProducedPhones: capacityOfNewlyProducedPhonesAdjustment,
      capacityOfPhonesInUse: capacityOfPhonesInUseAdjustment,
      capacityOfRecycledMaterials: capacityOfRecycledMaterialsAdjustment,
      capacityOfRefurbishedPhones: capacityOfRefurbishedPhonesAdjustment,
      capacityOfRepairedPhones: repairShopCapcityAdjustment,
      phonesInUse:
        acquireNewlyProduced +
        acquireRefurbished +
        acquireRepaired +
        acquireUsed -
        (abandon + goBroken),
      supplyOfBrokenPhones: goBroken - (disposeBroken + repair),
      supplyOfDisposedPhones:
        disposeBroken + disposeHibernating - (landfill + recycle),
      supplyOfHibernatingPhones:
        abandon - (acquireUsed + disposeHibernating + refurbish),
      supplyOfNaturalResources:
        mineNaturalResources - produceFromNaturalResources,
      supplyOfNewlyProducedPhones:
        produceFromNaturalResources +
        produceFromRecycledMaterials -
        acquireNewlyProduced,
      supplyOfRecycledMaterials: recycle - produceFromRecycledMaterials,
      supplyOfRefurbishedPhones: refurbish - acquireRefurbished,
      supplyOfRepairedPhones: repair - acquireRepaired,
    };

    return flowPerStock;
  }
}

export type {
  StockIds,
  StockId,
  Stocks,
  StockArray,
  FlowIds,
  FlowId,
  Flows,
  FlowArray,
  VariableIds,
  VariableId,
  Variables,
  VariableArray,
  ParameterIds,
  ParameterId,
  Parameters,
  ParameterArray,
  Record,
};

export { CircularEconomyModel, stockIds, flowIds, variableIds, parameterIds };
