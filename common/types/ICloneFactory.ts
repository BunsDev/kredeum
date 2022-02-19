/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface ICloneFactoryInterface extends utils.Interface {
  contractName: "ICloneFactory";
  functions: {
    "addImplementation(address)": FunctionFragment;
    "implementations(uint256)": FunctionFragment;
    "implementationsCount()": FunctionFragment;
    "setContractProbe(address)": FunctionFragment;
    "setDefaultTemplate(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addImplementation",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "implementations",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "implementationsCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setContractProbe",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setDefaultTemplate",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "addImplementation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "implementations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "implementationsCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setContractProbe",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDefaultTemplate",
    data: BytesLike
  ): Result;

  events: {};
}

export interface ICloneFactory extends BaseContract {
  contractName: "ICloneFactory";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ICloneFactoryInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addImplementation(
      implementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    implementations(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    implementationsCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    setContractProbe(
      probe: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setDefaultTemplate(
      template: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addImplementation(
    implementation: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  implementations(
    index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  implementationsCount(overrides?: CallOverrides): Promise<BigNumber>;

  setContractProbe(
    probe: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setDefaultTemplate(
    template: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addImplementation(
      implementation: string,
      overrides?: CallOverrides
    ): Promise<void>;

    implementations(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    implementationsCount(overrides?: CallOverrides): Promise<BigNumber>;

    setContractProbe(probe: string, overrides?: CallOverrides): Promise<void>;

    setDefaultTemplate(
      template: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    addImplementation(
      implementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    implementations(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    implementationsCount(overrides?: CallOverrides): Promise<BigNumber>;

    setContractProbe(
      probe: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setDefaultTemplate(
      template: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addImplementation(
      implementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    implementations(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    implementationsCount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setContractProbe(
      probe: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setDefaultTemplate(
      template: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}