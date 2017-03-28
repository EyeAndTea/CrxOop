//version: 1.2.01
/*
The MIT License (MIT) 

Copyright (c) 2016 ObIb

ObIb: Ob are the first two letters of my first name, and Ib are the first two letters
of my father's father's (grandfather's) first name. I was the senior developer at Creatrix Design
Group (website: creatrix.ca. address:2764 Richmond Rd, Ottawa Ontario Canada   K2B6S2),  during
but not limited to the year 2014. This information is part of the license and uniquely identifies
me, the license holder.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT
OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function()
{
	//"use strict";

	if(window.crx_registerClass)
		{return;}

	var gIS_STRICT_MODE = true;
	var gIS_STRICT_JS_SUPPORTED = (function(){"use strict"; return !this;})();
	var gIS_STRICT_JS = (gIS_STRICT_JS_SUPPORTED ? (function(){return !this;})() :
			(window.CRXNS_NON_STRICT_MODE ? false : true));
	var gCODE_KEY = function(){};
	var gSecureClassData_return = null;
	var gFunc_createObject = null;
	var gFunc_sealObject = (Object.seal && gIS_STRICT_MODE ? Object.seal : function(){});
	var gFunc_freezeObject = (Object.freeze ? Object.freeze : function(){});
	var gIsReadOnlyWriteSupported = false;
	var gIsStarted = false;
	var gIsRunningTestCasesMode = false;
	var gIsHalted = false;
	var gHaltMessage = null;
	var gClassSignatures = {};  //Class Name => Class ID
	var gClassDefinitions = {}; /*Class ID => Class Non Verbose Definition.  NOTE: CLASSE DEFINITIONS ARE NON VERBOSE CLASS DEFINITIONS, AND ALL
			VERBOSE DEFINITIONS HAVE A CLASS DEFINITION (NON VERBOSE) ENTRY HERE. CLASSE DEFINITIONS MUST NEVER BE RETURNED TO THE USER UNLESS THE
			CLASS IS THE SAME INSTNACE OF DEFINITION BY THE USER, I.E NON VERBOSE DEFNITION.*/
	var gClassesWithVerboseDefinitions = {};//Class ID => Class Verbose Definition || NULL
	var gCompiledClasses = {};
	var gClassIDCounter = 1;
	var gClassFTables = {};
	var gClassVTables = {};
	var gClassVTables_firstOccurances = {};
	var gClassVTables_lastOccurances = {};
	var gClassVirtualFinalFunctions = {};
	var gClassMemberScopes = {};
	var gClassMemberTypes = {};
	var gClassPublicStatics = {};
	var gClassPrivateStatics = {};
	var gCheckedClassDefinitions = {};
	var gCheckedClassAdherenceToInterfaces = {};
	var gClassInterfaceFullTraces = {};
	var gClassInterfaceTraces = {};
	var gInterfaceSignatures = {};
	var gInterfaceIDCounter = 1;
	var gInterfaceDefinitions = {}; //Interface ID => Interface Definition
	var gInterfaceBuilds = {};
	var gParsingData = {};
	var gFunc_log = function(pMessage, pLevel){g_Func_log("CrxOop ==> " + pMessage, pLevel);};
	var g_Func_log = function(pMessage, pLevel){if(window.console){window.console.log(pMessage);}};
	var gNamesOfTypes =
	{
		"[object Boolean]": "boolean",
		"[object Number]": "number",
		"[object String]": "string",
		"[object Function]": "function",
		"[object Array]": "array",
		"[object Date]": "date",
		"[object RegExp]": "regexp",
		"[object Object]": "object",
		"[object Error]":  "error"
	};
	var gStaticContext = [null, null];
	var gStackOfIsConstructorCalled = [];
	var gIsConstructorCalled = {};
	var gTestObject = {};

	if(!Object.create)
	{
		gFunc_createObject = function(vPrototype)
		{
			function t(){};
			t.prototype = vPrototype;
			return new t();
		}
	}
	else
		{gFunc_createObject = Object.create;}

	if(Object.defineProperty)
	{
		var tObject = {};

		try
		{
			Object.defineProperty(tObject, 's', {value: 'd', writable: false});
			gIsReadOnlyWriteSupported = true;
		}
		catch(tE)
			{}
	}

	function _eTest(){if(!gTestObject.x){gIS_STRICT_JS = true};}
	function _eTest2(){return (_eTest2.caller === _eTest);}
	if(gIsReadOnlyWriteSupported && !gIS_STRICT_JS)
	{
		Object.defineProperty(gTestObject, "x",
		{
			get: _eTest2,
			set: function(){},
			enumerable: true
		});
		_eTest();
	}
	
	if(!gIsReadOnlyWriteSupported && !gIS_STRICT_JS)
		{halt('CURRENT BROWSER IS NOT SUPPORTED IN NON STRICT MODE');}

	function getType(pObject)
	{
		if(pObject == null)
			{return (pObject + "");}
		return (((typeof(pObject) === "object") || (typeof(pObject) === "function")) ?
				(gNamesOfTypes[Object.prototype.toString.call(pObject)] || "object") : (typeof(pObject)));
	}

	function registerClass(pClassName, pClassDefinition)
	{
		if(gIsHalted){return;}

		gIsStarted = true;

		if(gClassSignatures.hasOwnProperty(pClassName) ||
				gInterfaceSignatures.hasOwnProperty(pClassName))
			{halt("Interface or Class with name '" + pClassName + "' already declared");}

		if(!pClassDefinition.CRX_CLASS_ID)
		{
			pClassDefinition.CRX_DEFINITION = true;
			pClassDefinition.CRX_CLASS_ID = gClassIDCounter;
			pClassDefinition.CRX_CLASS_NAME = pClassName;

			if((pClassDefinition.CRX_DEFINITION !== true) || (pClassDefinition.CRX_CLASS_ID !== pClassDefinition.CRX_CLASS_ID) ||
					(pClassDefinition.CRX_CLASS_NAME !== pClassName) || (pClassDefinition.CRX_INTERFACE_ID !== undefined))
				{halt("UNKNOWN ERROR IN DEFINITION OF CLASS '" + pClassName + "'");}
			gFunc_freezeObject(pClassDefinition);

			inspectClassDefinition_processVerboseDefinition(pClassDefinition);
			gClassIDCounter = gClassIDCounter + 1;
		}
		gClassSignatures[pClassName] = pClassDefinition.CRX_CLASS_ID;
	}
	function getClassDefinition(pClassDefinitionOrClassName)
	{
		if(gIsHalted){return;}

		if(typeof(pClassDefinitionOrClassName) === "string")
		{
			if(!gClassSignatures[pClassDefinitionOrClassName])
				{return null;}
			else
			{
				return (gClassDefinitions[gClassSignatures[pClassDefinitionOrClassName]] || null);
			}
		}
		else if(pClassDefinitionOrClassName.CRX_INTERFACE_ID !== undefined)
			{return null;}
		else
		{
			if(!pClassDefinitionOrClassName.CRX_CLASS_ID)
			{
				pClassDefinitionOrClassName.CRX_DEFINITION = true;
				pClassDefinitionOrClassName.CRX_CLASS_ID = gClassIDCounter;

				if((pClassDefinitionOrClassName.CRX_DEFINITION !== true) ||
						(pClassDefinitionOrClassName.CRX_CLASS_ID !== pClassDefinitionOrClassName.CRX_CLASS_ID))
					{halt("UNKNOWN ERROR IN DEFINITION OF CLASS '$C" + gClassIDCounter + "'");}
				gFunc_freezeObject(pClassDefinitionOrClassName);

				inspectClassDefinition_processVerboseDefinition(pClassDefinitionOrClassName);
				gClassIDCounter = gClassIDCounter + 1;
			}

			return gClassDefinitions[pClassDefinitionOrClassName.CRX_CLASS_ID];
		}
	}
	function getClassID(pClassDefinitionOrClassName)
	{
		if(gIsHalted){return;}

		if(typeof(pClassDefinitionOrClassName) === "string")
			{return (gClassSignatures[pClassDefinitionOrClassName] || null);}
		return (pClassDefinitionOrClassName.CRX_CLASS_ID || null);
	}
	function getClassNameOrID(pClass)
	{
		if(pClass.CRX_CLASS_NAME)
			{return pClass.CRX_CLASS_NAME;}
		if(pClass.CRX_CLASS_ID)
			{return "$C" + pClass.CRX_CLASS_ID;}
		return null;
	}

	function registerInterface(pInterfaceName, pInterface)
	{
		if(gIsHalted){return;}

		gIsStarted = true;

		if(gClassSignatures.hasOwnProperty(pInterfaceName) ||
				gInterfaceSignatures.hasOwnProperty(pInterfaceName))
			{halt("Interface or Class with name '" + pInterfaceName + "' already declared");}

		if(!pInterface.CRX_INTERFACE_ID)
		{
			pInterface.CRX_DEFINITION = true;
			pInterface.CRX_INTERFACE_ID = gInterfaceIDCounter;
			pInterface.CRX_INTERFACE_NAME = pInterfaceName;

			if((pInterface.CRX_DEFINITION !== true) || (pInterface.CRX_INTERFACE_ID !== gInterfaceIDCounter) ||
					(pInterface.CRX_INTERFACE_NAME !== pInterfaceName) ||
					(pInterface.CRX_CLASS_ID !== undefined))
				{halt("UNKNOWN ERROR IN DEFINITION OF INTERFACE '" + pInterfaceName + "'");}
			gFunc_freezeObject(pInterface);

			gInterfaceDefinitions[gInterfaceIDCounter] = pInterface;
			gInterfaceIDCounter = gInterfaceIDCounter + 1;
		}
		gInterfaceSignatures[pInterfaceName] = pInterface.CRX_INTERFACE_ID;
	}
	function getInterface(pInterfaceOrInterfaceName)
	{
		if(gIsHalted){return;}

		if(typeof(pInterfaceOrInterfaceName) === "string")
		{
			if(!gInterfaceSignatures[pInterfaceOrInterfaceName])
				{return null;}
			else
				{return (gInterfaceDefinitions[gInterfaceSignatures[pInterfaceOrInterfaceName]] || null);}
		}
		else if(pInterfaceOrInterfaceName.CRX_CLASS_ID !== undefined)
			{return null;}
		else
		{
			if(!pInterfaceOrInterfaceName.CRX_INTERFACE_ID)
			{
				pInterfaceOrInterfaceName.CRX_DEFINITION = true;
				pInterfaceOrInterfaceName.CRX_INTERFACE_ID = gInterfaceIDCounter;

				if((pInterfaceOrInterfaceName.CRX_DEFINITION !== true) ||
						(pInterfaceOrInterfaceName.CRX_INTERFACE_ID !== gInterfaceIDCounter))
					{halt("UNKNOWN ERROR IN DEFINITION OF INTERFACE '$I" + gInterfaceIDCounter + "'");}
				gFunc_freezeObject(pInterfaceOrInterfaceName);

				gInterfaceDefinitions[gInterfaceIDCounter] = pInterfaceOrInterfaceName;
				gInterfaceIDCounter = gInterfaceIDCounter + 1;
			}

			return gInterfaceDefinitions[pInterfaceOrInterfaceName.CRX_INTERFACE_ID];
		}
	}
	function getInterfaceID(pInterfaceOrInterfaceName)
	{
		if(gIsHalted){return;}

		if(typeof(pInterfaceOrInterfaceName) === "string")
			{return (gInterfaceSignatures[pInterfaceOrInterfaceName] || null);}
		return (pInterfaceOrInterfaceName.CRX_INTERFACE_ID || null);
	}
	function getInterfaceNameOrID(pInterface)
	{
		if(pInterface.CRX_INTERFACE_NAME)
			{return pInterface.CRX_INTERFACE_NAME;}
		if(pInterface.CRX_INTERFACE_ID)
			{return "$I" + pInterface.CRX_INTERFACE_ID;}
		return null;
	}

	/*function _new(pClassDefinitionOrClassName, pParameter01, pParameter02, ...)*/
	/*function _new(pLength, pClassDefinitionOrClassName, pParameter01, pParameter02, ...)*/
	/*function _new(pLength, pParametersArray, pClassDefinitionOrClassName)*/
	/*function _new(pLength, pParametersFunction, pClassDefinitionOrClassName)*/
	function _new(pParameter1, pParameter2, pParameter3)
	{
		if(gIsHalted){return;}

		var vIS_ARRAY_MODE = false;
		var vClass = null;
		var vObjects = [];
		var vCRX_CLASS_INFOs = [];
		var vLength = -1;
		var vParameters = null;
		var vTypeOfParameter2 = getType(pParameter2);
		var tI = 0;

		gIsStarted = true;

		gStackOfIsConstructorCalled.push(gIsConstructorCalled);
		gIsConstructorCalled = {};		

		if(typeof(pParameter1) === "number")
		{
			vIS_ARRAY_MODE = true;
			vLength = Math.abs(pParameter1);
			if((vTypeOfParameter2 !== 'array') && (vTypeOfParameter2 !== 'function'))
			{
				vClass = getClassDefinition(pParameter2);
				vParameters = Array.prototype.slice.call(arguments, 2);
			}
			else
			{
				if((vTypeOfParameter2 === 'array') && (pParameter2.length < 1))
					{return null;}
				vClass = getClassDefinition(pParameter3);
				vParameters = pParameter2;
			}
		}
		else
		{
			vClass = getClassDefinition(pParameter1);
			vLength = 1;
			vParameters = Array.prototype.slice.call(arguments, 1);
		}

		if(vClass === null)
			{halt("UNABLE TO RESOLVE CLASS DURING CALL TO crx_new");}

		for(tI = 0; tI < vLength; tI++)
			{vCRX_CLASS_INFOs[tI] = {};}

		prepareClass(vClass);
		if(gIsHalted){return null;}

		if(gParsingData[vClass.CRX_CLASS_ID].remainingAbstractVirtuals.length > 0)
		{
			var tRestOfMessage = "";
			var tIsNotFirst = false;

			for(tKey in gParsingData[vClass.CRX_CLASS_ID].remainingAbstractVirtuals.p)
			{
				if(!gParsingData[vClass.CRX_CLASS_ID].remainingAbstractVirtuals.p.hasOwnProperty(tKey))
					{continue;}

				tRestOfMessage += (tIsNotFirst ? ", \"" : "\"") + tKey + "()\"";
				tIsNotFirst = true;
			}
			halt("CAN NOT CREATE INSTANCE OF ABSTRACT CLASS \"" + getClassNameOrID(vClass) + "\". MISSING IMPLEMENTATIONS FOR FUNCTIONS " + tRestOfMessage);
		}

		vObjects = _new_build(gCompiledClasses[vClass.CRX_CLASS_ID], vCRX_CLASS_INFOs, {p: false}, vLength);

		if(vObjects.length === 0)
			{halt("UNKNOWN ERROR DURING CALL TO crx_new");}

		for(var tKey in gClassVTables[vClass.CRX_CLASS_ID])
		{
			if(!gClassVTables[vClass.CRX_CLASS_ID].hasOwnProperty(tKey))
				{continue;}

			for(tI = 0; tI < vLength; tI++)
			{
				setObjectReadOnlyMember(vCRX_CLASS_INFOs[tI].
						CRX_OBJECT_SEGMENTS[gClassVTables_firstOccurances[
						vClass.CRX_CLASS_ID][tKey]], tKey, ftable_this_call__virtualPublic(vClass.CRX_CLASS_ID, "puv", tKey));
			}
		}

		if(vObjects[0].CONSTRUCT)
		{
			try
			{
				if(!vIS_ARRAY_MODE)
				{
					vObjects[0].CONSTRUCT.apply(vObjects[0], vParameters);
					gIsConstructorCalled[vObjects[0].CRX_CLASS_ID] = false
					delete(vObjects[0].CONSTRUCT);
				}
				else
				{
					if(vTypeOfParameter2 === "function")
					{
						for(tI = 0; tI < vLength; tI++)
						{
							vObjects[tI].CONSTRUCT.apply(vObjects[tI], vParameters(tI));
							gIsConstructorCalled[vObjects[0].CRX_CLASS_ID] = false;
						}
					}
					else if(vTypeOfParameter2 === "array")
					{
						var tLength = vParameters.length;

						for(tI = 0; tI < vLength; tI++)
						{
							if(tI < tLength)
								{vObjects[tI].CONSTRUCT.apply(vObjects[tI], vParameters[tI]);}
							else
								{vObjects[tI].CONSTRUCT.apply(vObjects[tI], vParameters[tLength - 1]);}
							gIsConstructorCalled[vObjects[0].CRX_CLASS_ID] = false;
						}
					}
					else
					{
						for(tI = 0; tI < vLength; tI++)
						{
							vObjects[tI].CONSTRUCT.apply(vObjects[tI], vParameters);
							gIsConstructorCalled[vObjects[0].CRX_CLASS_ID] = false;
						}
					}
					for(tI = 0; tI < vLength; tI++)
						{delete(vObjects[tI].CONSTRUCT);}
					gIsConstructorCalled[vObjects[0].CRX_CLASS_ID] = false;
				}
			}
			catch(tE)
				{halt('CONSTRUCTION OF CLASS \"' + getClassNameOrID(vClass) + '\" THREW AN EXCEPTION: ' + tE);}
		}

		for(tI = 0; tI < vLength; tI++)
			{vCRX_CLASS_INFOs[tI].CRX_CLASS_ID = vClass.CRX_CLASS_ID;}

		if(gIS_STRICT_MODE)
		{
			for(var tKey in vCRX_CLASS_INFOs[0].CRX_OBJECT_SEGMENTS)
			{
				if(!vCRX_CLASS_INFOs[0].CRX_OBJECT_SEGMENTS.hasOwnProperty(tKey))
					{continue;}


				for(tI = 0; tI < vLength; tI++)
					{gFunc_sealObject(vCRX_CLASS_INFOs[tI].CRX_OBJECT_SEGMENTS[tKey]);}
			}
		}
		gIsConstructorCalled = gStackOfIsConstructorCalled.pop();

		if(!vIS_ARRAY_MODE)
			{return vObjects[0];}
		else
			{return vObjects;}
	}
	function _new_build(pCompiledClass, pCRX_CLASS_INFOs, pWereProtectedMembersEncountered, pLength)
	{
		var vObjects = [];
		var vObjects_privates = [];
		var vIsConstructorFound = false;
		var tI = 0;
		var tI2 = 0;

		if(pCompiledClass.EXTENDS !== null)
		{
			tObjects = _new_build(pCompiledClass.EXTENDS, pCRX_CLASS_INFOs, pWereProtectedMembersEncountered, pLength);

			for(tI = 0; tI < pLength; tI++)
			{
				vObjects[tI] = gFunc_createObject(tObjects[tI]);
				setObjectReadOnlyMember(vObjects[tI], 'PARENT', tObjects[tI]['THIS']);
			}

			if(vObjects[0] === null)
				{return null;}
		}
		else
		{
			for(tI = 0; tI < pLength; tI++)
			{
				vObjects[tI] = {};

				pCRX_CLASS_INFOs[tI].CRX_OBJECT_SEGMENTS = {};
				pCRX_CLASS_INFOs[tI].CRX_PRIVATE_OBJECT_SEGMENTS = {};

				setObjectReadOnlyMember(vObjects[tI], "CRX_CLASS_INFO", secureClassData(pCRX_CLASS_INFOs[tI]));
			}
			setObjectsReadOnlyMember(vObjects, "CAST", _cast);
			setObjectsReadOnlyMember(vObjects, "SR", _sr);
			
			for(tI = 0; tI < pLength; tI++)
				{vObjects[tI] = gFunc_createObject(vObjects[tI]);}
		}
		
		if(pCompiledClass.PROTECTED)
			{pWereProtectedMembersEncountered.p = true;}

		if(!pCompiledClass.PRIVATE && !gClassPrivateStatics[pCompiledClass.CRX_CLASS_ID] && !pWereProtectedMembersEncountered.p)
		{
			for(tI = 0; tI < pLength; tI++)
				{pCRX_CLASS_INFOs[tI].CRX_PRIVATE_OBJECT_SEGMENTS[pCompiledClass.CRX_CLASS_ID] = vObjects[tI];}
		}
		else
		{
			for(tI = 0; tI < pLength; tI++)
			{
				vObjects_privates[tI] = gFunc_createObject(vObjects[tI]);
				pCRX_CLASS_INFOs[tI].CRX_PRIVATE_OBJECT_SEGMENTS[pCompiledClass.CRX_CLASS_ID] =
						vObjects_privates[tI];
				setObjectReadOnlyMember(vObjects_privates[tI], "O", _this(vObjects_privates[tI]));
			}

			if(pCompiledClass.PRIVATE)
			{
				for(tI = pCompiledClass.PRIVATE_VARS.length - 1; tI > -1; tI--)
				{
					for(tI2 = 0; tI2 < pLength; tI2++)
					{
						vObjects_privates[tI2][pCompiledClass.PRIVATE_VARS[tI][0]] = pCompiledClass.PRIVATE_VARS[tI][1];
						setMemberPrivateCapture(pCompiledClass.CRX_CLASS_ID, vObjects_privates[tI2],
								vObjects[tI2], pCompiledClass.PRIVATE_VARS[tI][0]);
					}
				}
				for(tI = pCompiledClass.PRIVATE_FUNCTIONS.length - 1; tI > -1; tI--)
				{
					setObjectsReadOnlyMember(vObjects_privates, pCompiledClass.PRIVATE_FUNCTIONS[tI][0],
							ftable_this_call(pCompiledClass.CRX_CLASS_ID, 'pr', pCompiledClass.PRIVATE_FUNCTIONS[tI][0],
							pCompiledClass.PRIVATE_FUNCTIONS[tI][1], false));

					if(!gIS_STRICT_JS)
					{
						for(tI2 = 0; tI2 < pLength; tI2++)
						{
							setThisCallPrivateCapture(pCompiledClass.CRX_CLASS_ID, vObjects_privates[tI2],
									vObjects[tI2], pCompiledClass.PRIVATE_FUNCTIONS[tI][0]);
						}
					}
				}
			}

			if(gClassPrivateStatics[pCompiledClass.CRX_CLASS_ID])
			{
				setObjectsReadOnlyMember(vObjects_privates, "STATIC",
						gClassPrivateStatics[pCompiledClass.CRX_CLASS_ID]);
			}
		}

		for(tI = 0; tI < pLength; tI++)
			{setObjectReadOnlyMember(vObjects[tI], 'THIS', vObjects[tI]);}

		if(pCompiledClass.PUBLIC || pCompiledClass.PROTECTED)
		{
			var tObjects = [];

			for(tI = 0; tI < pLength; tI++)
				{tObjects[tI] = (vObjects_privates[tI] ? vObjects_privates[tI] : vObjects[tI]);}

			if(pCompiledClass.PUBLIC)
			{
				for(tI = pCompiledClass.PUBLIC_VARS.length - 1; tI > -1; tI--)
				{
					for(tI2 = 0; tI2 < pLength; tI2++)
						{vObjects[tI2][pCompiledClass.PUBLIC_VARS[tI][0]] = pCompiledClass.PUBLIC_VARS[tI][1];}
				}

				for(tI = pCompiledClass.PUBLIC_FUNCTIONS.length - 1; tI > -1; tI--)
				{
					setObjectsReadOnlyMember(vObjects, pCompiledClass.PUBLIC_FUNCTIONS[tI][0],
								ftable_this_call(pCompiledClass.CRX_CLASS_ID, "pu", pCompiledClass.PUBLIC_FUNCTIONS[tI][0],
								pCompiledClass.PUBLIC_FUNCTIONS[tI][1], false));
				}
				if(pCompiledClass.PUBLIC_CONSTRUCT !== null)
				{
					vIsConstructorFound = true;
					if(pCompiledClass.EXTENDS && vObjects[0].PARENT.CONSTRUCT)
					{
						for(tI = 0; tI < pLength; tI++)
						{
							vObjects[tI]['CONSTRUCT'] = this_call__constructor(tObjects[tI], vObjects[tI],
									pCompiledClass.PUBLIC_CONSTRUCT);
						}
					}
					else
					{
						for(tI = 0; tI < pLength; tI++)
						{
							vObjects[tI]['CONSTRUCT'] = this_call__constructor(tObjects[tI], vObjects[tI],
									pCompiledClass.PUBLIC_CONSTRUCT);
						}
					}
				}
				if(gClassPublicStatics[pCompiledClass.CRX_CLASS_ID])
					{setObjectsReadOnlyMember(vObjects, "STATIC", gClassPublicStatics[pCompiledClass.CRX_CLASS_ID]);}
				else
					{setObjectsReadOnlyMember(vObjects, "STATIC", null);}
			}
			if(pCompiledClass.PROTECTED)
			{
				/*for(tI = pCompiledClass.PUBLIC_VARS.length - 1; tI > -1; tI--)
				{
					for(tI2 = 0; tI2 < pLength; tI2++)
						{vObjects[tI2][pCompiledClass.PUBLIC_VARS[tI][0]] = pCompiledClass.PUBLIC_VARS[tI][1];}
				}*/

				for(tI = pCompiledClass.PROTECTED_FUNCTIONS.length - 1; tI > -1; tI--)
				{
					setObjectsReadOnlyMember(vObjects, pCompiledClass.PROTECTED_FUNCTIONS[tI][0],
								ftable_this_call(pCompiledClass.CRX_CLASS_ID, "pro", pCompiledClass.PROTECTED_FUNCTIONS[tI][0],
								pCompiledClass.PROTECTED_FUNCTIONS[tI][1], true));
				}
				/*if(gClassPublicStatics[pCompiledClass.CRX_CLASS_ID])
					{setObjectsReadOnlyMember(vObjects, "STATIC", gClassPublicStatics[pCompiledClass.CRX_CLASS_ID]);}
				else
					{setObjectsReadOnlyMember(vObjects, "STATIC", null);}*/
			}
			

			for(tI = 0; tI < pLength; tI++)
				{pCRX_CLASS_INFOs[tI].CRX_PRIVATE_OBJECT_SEGMENTS[pCompiledClass.CRX_CLASS_ID] = tObjects[tI];}
		}

		if(!vIsConstructorFound)
		{
			if(pCompiledClass.EXTENDS && vObjects[0].PARENT.CONSTRUCT)
			{
				if(vObjects_privates[0])
				{
					for(tI = 0; tI < pLength; tI++)
						{vObjects[tI].CONSTRUCT = this_call__constructor(vObjects_privates[tI], vObjects[tI]);}
				}
				else
				{
					for(tI = 0; tI < pLength; tI++)
						{vObjects[tI].CONSTRUCT = this_call__constructor(vObjects[tI], vObjects[tI]);}
				}
			}
		}

		for(tI = 0; tI < pLength; tI++)
			{pCRX_CLASS_INFOs[tI].CRX_OBJECT_SEGMENTS[pCompiledClass.CRX_CLASS_ID] = vObjects[tI];}
		setObjectsReadOnlyMember(vObjects, "CRX_CLASS_ID", pCompiledClass.CRX_CLASS_ID);

		return vObjects;
	}
	function this_call(pPrivateThis, pPublicThis, pFunction)
	{
		return function() {
			if(gIsHalted){return;}
			return pFunction.apply(pPrivateThis, arguments);
		};
	}
	function this_call__constructor(pPrivateThis, pPublicThis, pFunction)
	{
		if(pFunction)
		{
			return function(){
				if(gIsHalted){return;}
				if(gIsConstructorCalled[pPublicThis.CRX_CLASS_ID])
					{halt('SECOND CALL TO CONSTRUCTOR');}
				gIsConstructorCalled[pPublicThis.CRX_CLASS_ID] = true;
				if(pPublicThis.PARENT)
				{
					if(gIsConstructorCalled[pPublicThis.PARENT.CRX_CLASS_ID])
						{halt('UNKNOWN CONSTRUCTION ERROR');}
					pFunction.apply(pPrivateThis, arguments);
					if(!gIsConstructorCalled[pPublicThis.PARENT.CRX_CLASS_ID])
						{pPublicThis.PARENT.CONSTRUCT();}
					if(!gIsConstructorCalled[pPublicThis.PARENT.CRX_CLASS_ID])
						{halt('UNKNOWN CONSTRUCTION ERROR');}
					gIsConstructorCalled[pPublicThis.PARENT.CRX_CLASS_ID] = false;
					delete(pPublicThis.PARENT.CONSTRUCT);
				}
				else
					{pFunction.apply(pPrivateThis, arguments);}
			};
		}
		else
		{
			return function(){
				if(gIsHalted){return;}
				gIsConstructorCalled[pPublicThis.CRX_CLASS_ID] = true;
				pPublicThis.PARENT.CONSTRUCT();
			};
		}
	}
	function ftable_this_call(pClassID, pFTableIndex, pKey, pFunction, pIsProtected)
	{
		if(gClassFTables[pClassID] && gClassFTables[pClassID][pFTableIndex] &&
				gClassFTables[pClassID][pFTableIndex][pKey])
			{return gClassFTables[pClassID][pFTableIndex][pKey];}
		else
		{
			if(!gClassFTables[pClassID])
				{gClassFTables[pClassID] = {};}
			if(!gClassFTables[pClassID][pFTableIndex])
				{gClassFTables[pClassID][pFTableIndex] = {};}

			if(pIsProtected)
			{
				gClassFTables[pClassID][pFTableIndex][pKey] = (function(pClassID, pFunction)
				{
					return function(){
						if(gIsHalted){return;}
						
						return pFunction.apply(ftable_this_call__checkAccessToProtectedIsValidAndGetThis(this, pClassID, pKey),
								arguments);
					}
				})(pClassID, pFunction);
			}
			else
			{
				gClassFTables[pClassID][pFTableIndex][pKey] = (function(pClassID, pFunction)
				{
					return function(){
						if(gIsHalted){return;}

						return pFunction.apply(getClassInfoObject(this).CRX_PRIVATE_OBJECT_SEGMENTS[pClassID],
								arguments);
					}
				})(pClassID, pFunction);
			}
		}

		return gClassFTables[pClassID][pFTableIndex][pKey];
	}
	function ftable_this_call__checkAccessToProtectedIsValidAndGetThis(pCallerThis, pClassID, pKey)
	{
		var vClassInfoObject = getClassInfoObject(pCallerThis);
		var vClassID = getObjectClassIDGivenClassInfoObject(pCallerThis.THIS, vClassInfoObject);

		if((vClassID !== null) && (vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[vClassID] === pCallerThis))
		{
			var tIsFound = null;

			for(var tKey in vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS)
			{
				if(!vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS.hasOwnProperty(tKey))
					{continue;}

				if(tKey == pClassID)
					{tIsFound = true;}
				if(tIsFound && (tKey == vClassID))
					{return vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[pClassID];}
			}
		}
		halt("ILLEGAL ACCESS TO PROTECTED METHOD '" + getClassNameOrID(gClassDefinitions[pClassID]) + "::" + pKey + "()'");
	}
	function ftable_this_call__virtualPublic(pClassID, pFTableIndex, pKey/*, pFunction*/)
	{
		if(gClassFTables[pClassID] && gClassFTables[pClassID][pFTableIndex] &&
				gClassFTables[pClassID][pFTableIndex][pKey])
			{return gClassFTables[pClassID][pFTableIndex][pKey];}
		else
		{
			if(!gClassFTables[pClassID])
				{gClassFTables[pClassID] = {};}
			if(!gClassFTables[pClassID][pFTableIndex])
				{gClassFTables[pClassID][pFTableIndex] = {};}

			gClassFTables[pClassID][pFTableIndex][pKey] = (function(pClassID, pKey/*, pFunction*/)
			{
				return function(){
					if(gIsHalted){return;}

					return /*pFunction*/gClassVTables[pClassID][pKey].apply(
							ftable_this_call__virtualPublic__checkAccessToProtectedIsValidAndGetThis(this, pClassID, pKey,
							(gIS_STRICT_JS ? null : gClassFTables[pClassID][pFTableIndex][pKey].caller)), arguments);
				}
			})(pClassID, pKey/*, pFunction*/);
		}

		return gClassFTables[pClassID][pFTableIndex][pKey];
	}
	function ftable_this_call__virtualPublic__checkAccessToProtectedIsValidAndGetThis(pCallerThis, pClassID, pKey, pCaller)
	{
		var vClassInfoObject = getClassInfoObject(pCallerThis);
		var vClassID = getObjectClassIDGivenClassInfoObject(pCallerThis.THIS, vClassInfoObject);
		var vClassID2 = gClassVTables_lastOccurances[vClassID][pKey];

		/*if(gCompiledClasses[vClassID2].PROTECTED && gCompiledClasses[vClassID2].PROTECTED_VIRTUAL &&
				(gCompiledClasses[vClassID2].PROTECTED_VIRTUAL_FUNCTIONS.length > 0) &&
				((gClassDefinitions[vClassID2].PROTECTED.VIRTUAL.FUNCTIONS &&
								gClassDefinitions[vClassID2].PROTECTED.VIRTUAL.FUNCTIONS.hasOwnProperty(pKey)) ||
						(gClassDefinitions[vClassID2].PROTECTED.VIRTUAL.FINAL &&
										gClassDefinitions[vClassID2].PROTECTED.VIRTUAL.FINAL.FUNCTIONS &&
										gClassDefinitions[vClassID2].PROTECTED.VIRTUAL.FINAL.FUNCTIONS.hasOwnProperty(pKey))))*/
		if(gClassMemberScopes[vClassID2].PRIVATE[pKey])
		{
			var tIsInValid = true;

			if(!((vClassID2 === vClassID) && ((vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[vClassID] === pCallerThis) ||
					(!gIS_STRICT_JS && (gStaticContext[0] === vClassID) && (gStaticContext[1] === pCaller)))))
				{halt("ILLEGAL ACCESS TO PRIVATE VIRTUAL METHOD '" + getClassNameOrID(gClassDefinitions[vClassID2]) + "::" + pKey + "()'");}
		}
		else if(gClassMemberScopes[vClassID2].PROTECTED[pKey])
		{
			var tIsInValid = true;

			if((vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[vClassID] === pCallerThis) ||
					(!gIS_STRICT_JS && (gStaticContext[0] === vClassID) && (gStaticContext[1] === pCaller)))
			{
				/*var tIsFound = false;

				for(var tKey in vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS)
				{
					if(!vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS.hasOwnProperty(tKey))
						{continue;}

					if(tKey == vClassID2)
						{tIsFound = true;}
					if(tIsFound && (tKey == vClassID))
						{tIsInValid = false;}
				}*/
				tIsInValid = false;
			}
			if(tIsInValid)
				{halt("ILLEGAL ACCESS TO PROTECTED VIRTUAL METHOD '" + getClassNameOrID(gClassDefinitions[vClassID2]) + "::" + pKey + "()'");}
		}

		return vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[gClassVTables_lastOccurances[pClassID][pKey]];
	}
	
	/*START: SUPPRT STATIC FUNCTIONS (NON STRICT JS MODE ONLY)*/
	function setThisCallPrivateCapture(pClassID, pPrivateThis, pPublicThis, pKey)
	{
		/*if(gIS_STRICT_JS)
			{return;}*/

		function vFunction()
			{return setThisCallPrivateCapture_resolve(this, pClassID, pPrivateThis, pPublicThis, pKey, vFunction.caller);}

		Object.defineProperty(pPublicThis, pKey,
		{
			get: vFunction,
			set: function(){},
			enumerable: false
		});
	}
	function setThisCallPrivateCapture_resolve(pThis, pClassID, pPrivateThis, pPublicThis, pKey, pCaller)
	{
		if(pThis === pPublicThis)
		{
			if((gStaticContext[0] === pClassID) && (pCaller === gStaticContext[1]))
				{return pPrivateThis[pKey];}
		}
		else if(pThis !== pPrivateThis)
		{
			var tObject = pPublicThis.PARENT;

			while(tObject)
			{
				if(gClassMemberTypes[tObject.CRX_CLASS_ID])
				{
					if(!gClassMemberScopes[tObject.CRX_CLASS_ID].PRIVATE[pKey])
					{
						if(gClassMemberTypes[tObject.CRX_CLASS_ID].FUNCTIONS[pKey] ||
								gClassMemberTypes[tObject.CRX_CLASS_ID].VARS[pKey])
							{return tObject[pKey];}
					}

					tObject = tObject.PARENT;
				}
				else
					{break;}
			}

			return undefined;
		}
		else
			{return undefined;}
	}
	function static_call(pClassID, pFunction)
	{
		var vCurrentStaticContext = [null, null]
		var vFunction = function()
		{
			if(gIsHalted){return;}

			var vReturn = null;
			var vIsException = true;
			var vException = null;

			vCurrentStaticContext[0] = gStaticContext[0];
			vCurrentStaticContext[1] = gStaticContext[1];

			gStaticContext[0] = pClassID;
			gStaticContext[1] = pFunction;

			try
			{
				vReturn = pFunction.apply(null, arguments);
				vIsException = false;
			}
			catch(tE)
				{vException = tE;}

			gStaticContext[0] = vCurrentStaticContext[0];
			gStaticContext[1] = vCurrentStaticContext[1];

			if(vIsException)
				{throw vException;}
			else
				{return vReturn;}
		};

		return vFunction;
	}
	function setMemberPrivateCapture(pClassID, pPrivateThis, pPublicThis, pKey)
	{
		if(gIS_STRICT_JS)
			{return;}

		function vFunction()
			{return setThisCallPrivateCapture_resolve(this, pClassID, pPrivateThis, pPublicThis, pKey, vFunction.caller);}
		/*{
			if((this === pPublicThis) && (gStaticContext[0] === pClassID) && (vFunction.caller === gStaticContext[1]))
				{return pPrivateThis[pKey];}
			else
				{return undefined;}
		}*/
		function vFunction2(pValue)
			{setMemberPrivateCapture_setter(this, pClassID, pPrivateThis, pPublicThis, pKey, vFunction2.caller, pValue);}
		/*{
			if((this === pPublicThis) && (gStaticContext[0] === pClassID) && (vFunction2.caller === gStaticContext[1]))
				{pPrivateThis[pKey] = pValue;}
			else
				{return;}
		}*/

		Object.defineProperty(pPublicThis, pKey,
		{
			get: vFunction,
			set: vFunction2,
			enumerable: true
		});
	}
	function setMemberPrivateCapture_setter(pThis, pClassID, pPrivateThis, pPublicThis, pKey, pCaller, pValue)
	{
		if(pThis === pPublicThis)
		{
			if((gStaticContext[0] === pClassID) && (pCaller === gStaticContext[1]))
				{pPrivateThis[pKey] = pValue;}
		}
		else if(pThis !== pPrivateThis)
		{
			var tObject = pPublicThis.PARENT;

			while(tObject)
			{
				if(gClassMemberTypes[tObject.CRX_CLASS_ID])
				{
					if(!gClassMemberScopes[tObject.CRX_CLASS_ID].PRIVATE[pKey])
					{
						if(gClassMemberTypes[tObject.CRX_CLASS_ID].FUNCTIONS[pKey] ||
								gClassMemberTypes[tObject.CRX_CLASS_ID].VARS[pKey])
							{tObject[pKey] = pValue;}
					}

					tObject = tObject.PARENT;
				}
				else
					{break;}
			}
		}
	}
	/*END: SUPPRT STATIC FUNCTIONS (NON STRICT JS MODE ONLY)*/
	function getClassInfoObject(pObject)
	{
		/*var vKey = gCODE_KEY;
		var vReturn = pObject.CRX_CLASS_INFO(gCODE_KEY);
		
		if((vKey === gCODE_KEY) || (vReturn === undefined))
			{halt('SECURITY ERROR, ACCESS VIOLATION');}*/
		
		var vReturn = null;

		pObject.CRX_CLASS_INFO();
		vReturn = gSecureClassData_return;
		gSecureClassData_return = null;

		if(vReturn === null)
			{halt('SECURITY ERROR, ACCESS VIOLATION');}

		return vReturn;
	}
	function getObjectClassID(pObject)
	{
		return ((pObject.CRX_CLASS_ID && (pObject === getClassInfoObject(pObject).CRX_OBJECT_SEGMENTS[pObject.CRX_CLASS_ID])) ? 
				pObject.CRX_CLASS_ID : null);
	}
	function getObjectClassIDGivenClassInfoObject(pObject, pClassInfoObject)
	{
		return ((pObject.CRX_CLASS_ID && pClassInfoObject && (pObject === pClassInfoObject.CRX_OBJECT_SEGMENTS[pObject.CRX_CLASS_ID])) ? 
				pObject.CRX_CLASS_ID : null);
	}
	function getObjectClassIDFast(pObject)//INSECURE
		{return (pObject.CRX_CLASS_ID ? pObject.CRX_CLASS_ID : null);}
	
	function prepareClass(pClassDefinition)
	{
		gIsStarted = true;
		inspectClassDefinition(pClassDefinition);

		if(!gClassVTables[pClassDefinition.CRX_CLASS_ID])
		{
			var tCompiledClass = gCompiledClasses[pClassDefinition.CRX_CLASS_ID];

			while(tCompiledClass)
			{
				buildStatics(gClassDefinitions[tCompiledClass.CRX_CLASS_ID]);
				buildVFTable(tCompiledClass);
				tCompiledClass = tCompiledClass.EXTENDS;
			}

			var vErrors = [];
			var vWarnings = [];
			verifyClassAdherenceToInterfaces(gCompiledClasses[pClassDefinition.CRX_CLASS_ID], vErrors, vWarnings);
			//inspectClassDefinition__interfaces(gClassDefinitions[pClassDefinition.CRX_CLASS_ID]);
			
			for(var tI = 0; tI < vWarnings.length; tI++)
				{gFunc_log("WARNING: " + vWarnings[tI], 1);}
			for(var tI = 0; tI < vErrors.length; tI++)
				{gFunc_log("FATAL ERROR: " + vErrors[tI], 0);}

			if(vErrors.length > 0)
				{halt("DEFINITION ERROR");}
		}
	}
	function inspectClassDefinition(pClassDefinition)
	{
		if(gCheckedClassDefinitions[pClassDefinition.CRX_CLASS_ID])
			{return pClassDefinition;}

		var vErrors = [];
		var vWarnings = [];
		var vParsingData = {};

		vParsingData['extensionChain'] = {};
		vParsingData['virtuals'] = {};
		vParsingData['nonVirtuals'] = {};
		vParsingData['virtualFinalFunctions'] = {};
		vParsingData['remainingAbstractVirtuals'] = {p:{}, length:0};

		inspectClassDefinition_processVerboseDefinition(pClassDefinition);
		inspectClassDefinition__interfaces(gClassDefinitions[pClassDefinition.CRX_CLASS_ID], vErrors, vWarnings);
		inspectClassDefinition_processDefinition(gClassDefinitions[pClassDefinition.CRX_CLASS_ID], vErrors, vWarnings, vParsingData);

		for(var tI = 0; tI < vWarnings.length; tI++)
			{gFunc_log("WARNING: " + vWarnings[tI], 1);}
		for(var tI = 0; tI < vErrors.length; tI++)
			{gFunc_log("FATAL ERROR: " + vErrors[tI], 0);}

		gCheckedClassDefinitions[pClassDefinition.CRX_CLASS_ID] = true;

		if(vErrors.length > 0)
			{halt("DEFINITION ERROR");}
	}
	function inspectClassDefinition_processVerboseDefinition(pClassDefinition)
	{
		if(gClassesWithVerboseDefinitions[pClassDefinition.CRX_CLASS_ID] !== undefined)
			{return;}
		for(var tKey in pClassDefinition)
		{
			if(tKey === 'VERBOSE')
			{
				var tClass = {};
				var tIsFirst = true;

				for(var tKey2 in pClassDefinition)
				{
					if(!pClassDefinition.hasOwnProperty(tKey2))
						{continue;}

					var tKeys = tKey2.split(/\s+/);
					var tClass2 = tClass

					if(tIsFirst)
					{
						tIsFirst = false;
						continue;
					}

					if(tKeys.length === 1)
						{tKeys[0] = tKeys[0].toUpperCase();}
					else
					{
						for(var tI = 0; tI < tKeys.length - 1; tI++)
						{
							tKeys[tI] = tKeys[tI].toUpperCase();

							if(tKeys[tI] === "FUNCTION")
								{tKeys[tI] = "FUNCTIONS";}
							else if(tKeys[tI] === "VAR")
								{tKeys[tI] = "VARS";}

							if(!tClass2[tKeys[tI]])
								{tClass2[tKeys[tI]] = {};}
							tClass2 = tClass2[tKeys[tI]];
						}
					}

					tClass2[tKeys[tKeys.length - 1]] = pClassDefinition[tKey2];
				}
				gFunc_freezeObject(tClass);
				gClassesWithVerboseDefinitions[pClassDefinition.CRX_CLASS_ID] = pClassDefinition;
				gClassDefinitions[pClassDefinition.CRX_CLASS_ID] = tClass;
			}
			else
			{
				gClassDefinitions[pClassDefinition.CRX_CLASS_ID] = pClassDefinition;
				gClassesWithVerboseDefinitions[pClassDefinition.CRX_CLASS_ID] = null;
			}
			break;
		}
	}
	function inspectClassDefinition_processDefinition(pClass, pErrors, pWarnings, pParsingData)
	{
		if(gParsingData.hasOwnProperty(pClass.CRX_CLASS_ID))
		{
			mergeToObject(pParsingData.virtuals, gParsingData[pClass.CRX_CLASS_ID].virtuals);
			mergeToObject(pParsingData.nonVirtuals, gParsingData[pClass.CRX_CLASS_ID].nonVirtuals);
			mergeToObject(pParsingData.virtualFinalFunctions, gParsingData[pClass.CRX_CLASS_ID].virtualFinalFunctions);
			mergeToObject(pParsingData.remainingAbstractVirtuals.p, gParsingData[pClass.CRX_CLASS_ID].remainingAbstractVirtuals.p);
			pParsingData.remainingAbstractVirtuals.length = gParsingData[pClass.CRX_CLASS_ID].remainingAbstractVirtuals.length;

			return;
		}

		if(pClass.hasOwnProperty("EXTENDS"))
		{
			var tClass = getClassDefinition(pClass.EXTENDS);

			if(tClass === null)
				{halt('MISSING DEFINITION FOR THE CLASS THAT IS EXTENED BY CLASS "' + getClassNameOrID(pClass) + '"');}
			if(pParsingData['extensionChain'].hasOwnProperty(tClass.CRX_CLASS_ID) ||
					(tClass.CRX_CLASS_ID === pClass.CRX_CLASS_ID))
				{halt('CIRCULAR EXTENSION DETECTED ON CLASS "' + getClassNameOrID(pClass) + '"');}
			pParsingData['extensionChain'][tClass.CRX_CLASS_ID] = true;

			inspectClassDefinition_processVerboseDefinition(tClass);
			inspectClassDefinition__interfaces(gClassDefinitions[tClass.CRX_CLASS_ID], pErrors, pWarnings);
			inspectClassDefinition_processDefinition(gClassDefinitions[tClass.CRX_CLASS_ID], pErrors, pWarnings, pParsingData);
		}

		parseClass(gClassDefinitions[pClass.CRX_CLASS_ID], pErrors, pWarnings, pParsingData.virtuals, pParsingData.nonVirtuals, 
				pParsingData.virtualFinalFunctions, pParsingData.remainingAbstractVirtuals);
	
		gParsingData[pClass.CRX_CLASS_ID] = {};
		gParsingData[pClass.CRX_CLASS_ID]['virtuals'] = {};
		gParsingData[pClass.CRX_CLASS_ID]['nonVirtuals'] = {};
		gParsingData[pClass.CRX_CLASS_ID]['virtualFinalFunctions'] = {};
		mergeToObject(gParsingData[pClass.CRX_CLASS_ID].virtuals, pParsingData.virtuals);
		mergeToObject(gParsingData[pClass.CRX_CLASS_ID].nonVirtuals, pParsingData.nonVirtuals);
		mergeToObject(gParsingData[pClass.CRX_CLASS_ID].virtualFinalFunctions, pParsingData.virtualFinalFunctions);
		gParsingData[pClass.CRX_CLASS_ID].remainingAbstractVirtuals = pParsingData.remainingAbstractVirtuals;
	}
	function inspectClassDefinition__interfaces(pClass, pErrors, pWarnings)
	{
		if(pClass.hasOwnProperty("IMPLEMENTS"))
		{
			if(getType(pClass["IMPLEMENTS"]) !== "array")
			{
				pErrors.push("'IMPLEMENTS' DEFINITION FOR CLASS '" + getClassNameOrID(pClass) +
						"' IS NOT AN ARRAY");
			}
			else
			{
				var tToBeImplemented = {};
				var tTemporaryInterface =
				{
					"INHERITS": [],
					"CRX_INTERFACE_ID": -1
				};
				var tClass = pClass;

				for(var tI = 0; tI < pClass["IMPLEMENTS"].length; tI++)
					{tTemporaryInterface['INHERITS'].push(pClass["IMPLEMENTS"][tI]);}

				buildInterface(tTemporaryInterface, pErrors, pWarnings)

				gClassInterfaceFullTraces[pClass.CRX_CLASS_ID] = gInterfaceBuilds[-1].fullTrace;
				gClassInterfaceTraces[pClass.CRX_CLASS_ID] = gInterfaceBuilds[-1].trace;
				
				delete gInterfaceBuilds[-1];
			}
		}
	}
	function verifyClassAdherenceToInterfaces(pCompiledClass, pErrors, pWarnings)
	{
		if(gCheckedClassAdherenceToInterfaces[pCompiledClass.CRX_CLASS_ID])
			{return;}

		var tCompiledClass = pCompiledClass.EXTENDS;

		if(tCompiledClass)
			{verifyClassAdherenceToInterfaces(tCompiledClass, pErrors, pWarnings)}

		for(var tKey in gClassInterfaceTraces[pCompiledClass.CRX_CLASS_ID])
		{
			if(!gClassInterfaceTraces[pCompiledClass.CRX_CLASS_ID].hasOwnProperty(tKey))
				{continue;}

			for(var tKey2 in gInterfaceBuilds[tKey].functions)
			{
				if(!gInterfaceBuilds[tKey].functions.hasOwnProperty(tKey2))
					{continue;}

				if(!gClassVTables_lastOccurances[pCompiledClass.CRX_CLASS_ID][tKey2])
				{
					pErrors.push("MISSING FUNCTION IMPLEMENTATION IN CLASS '" + getClassNameOrID(gClassDefinitions[pCompiledClass.CRX_CLASS_ID]) +
							"' FOR '" + 
							getInterfaceNameOrID(gInterfaceDefinitions[gInterfaceBuilds[tKey].functions[tKey2]]) + "::" +
							tKey2 + "()'");
				}
				else
				{
					if(gClassVTables_lastOccurances[pCompiledClass.CRX_CLASS_ID][tKey2] === pCompiledClass.CRX_CLASS_ID)
					{
						if(!gClassMemberScopes[pCompiledClass.CRX_CLASS_ID].PUBLIC[tKey2])
						{
							pErrors.push("FUNCTION '" + getClassNameOrID(gClassDefinitions[pCompiledClass.CRX_CLASS_ID]) + "::" + 
									tKey2 + "()', WHICH IS REQUIRED BY INTERFACE '" + 
									getInterfaceNameOrID(gInterfaceDefinitions[gInterfaceBuilds[tKey].functions[tKey2]]) + "', MUST BE PUBLIC");
						}
					}
					else
					{
						if(!gClassMemberScopes[gClassVTables_lastOccurances[pCompiledClass.CRX_CLASS_ID][tKey2]].PUBLIC[tKey2])
						{
							pErrors.push("MISSING FUNCTION IMPLEMENTATION IN CLASS '" + getClassNameOrID(gClassDefinitions[pCompiledClass.CRX_CLASS_ID]) +
									"' FOR '" + 
									getInterfaceNameOrID(gInterfaceDefinitions[gInterfaceBuilds[tKey].functions[tKey2]]) + "::" + tKey2 + 
											"()'. FUNCTION WAS FOUND IN THE EXTENSION CHAIN, IN THE  CLASS '" + 
											getClassNameOrID(gClassDefinitions[gClassVTables_lastOccurances[pCompiledClass.CRX_CLASS_ID][tKey2]]) +
											"', BUT IS NOT PUBLIC.");
						}
						else
						{
							pWarnings.push("FUNCTION IMPLEMENTATION FOR '" +
									getInterfaceNameOrID(gInterfaceDefinitions[gInterfaceBuilds[tKey].functions[tKey2]]) + 
									"::" + tKey2 + "()' IN CLASS '" + getClassNameOrID(gClassDefinitions[pCompiledClass.CRX_CLASS_ID]) +
									"' WAS FOUND IN EXTENSION CHAIN INSTEAD");
						}
					}
				}
			}
			//tToBeImplemented[tKey] = gInterfaceBuilds[-1].functions[tKey];
		}

		while(tCompiledClass)
		{
			for(var tKey in gClassInterfaceTraces[tCompiledClass.CRX_CLASS_ID])
			{
				if(!gClassInterfaceTraces[tCompiledClass.CRX_CLASS_ID].hasOwnProperty(tKey))
					{continue;}

				for(var tKey2 in gInterfaceBuilds[tKey].functions)
				{
					if(!gInterfaceBuilds[tKey].functions.hasOwnProperty(tKey2))
						{continue;}

					if(!gClassVTables_lastOccurances[pCompiledClass.CRX_CLASS_ID][tKey2])
						{halt("UNKOWN ERROR: SNH01");/*SHOULD NOT HAPPEN*/;}
					else
					{
						if(gClassVTables_lastOccurances[pCompiledClass.CRX_CLASS_ID][tKey2] === pCompiledClass.CRX_CLASS_ID)
						{
							if(!gClassMemberScopes[pCompiledClass.CRX_CLASS_ID].PUBLIC[tKey2])
							{
								pErrors.push("FUNCTION '" + getClassNameOrID(gClassDefinitions[pCompiledClass.CRX_CLASS_ID]) + "::" + 
										tKey2 + "()' IS REQUIRED BY INTERFACES, HENCE MUST REMAIN PUBLIC.");
							}
						}
						else
						{
							if(!gClassMemberScopes[gClassVTables_lastOccurances[pCompiledClass.CRX_CLASS_ID][tKey2]].PUBLIC[tKey2])
								{halt("UNKOWN ERROR: SNH02");/*SHOULD NOT HAPPEN*/;}
						}
					}
				}
				//tToBeImplemented[tKey] = gInterfaceBuilds[-1].functions[tKey];
			}
			tCompiledClass = tCompiledClass.EXTENDS;
		}

		/*while(tClass)
		{
			if(tClass.hasOwnProperty("PUBLIC") && tClass["PUBLIC"].hasOwnProperty("VIRTUAL") &&
					tClass["PUBLIC"]["VIRTUAL"].hasOwnProperty("FUNCTIONS"))
			{
				for(var tKey in tClass["PUBLIC"]["VIRTUAL"]["FUNCTIONS"])
				{
					if(!tClass["PUBLIC"]["VIRTUAL"]["FUNCTIONS"].hasOwnProperty(tKey))
						{continue;}

					if((typeof(tClass["PUBLIC"]["VIRTUAL"]["FUNCTIONS"][tKey]) === 'function') &&
							tToBeImplemented.hasOwnProperty(tKey))
					{
						if((tClass !== pClass) && (tToBeImplemented[tKey] !== true))
						{
							pWarnings.push("FUNCTION IMPLEMENTATION FOR '" +
									getInterfaceNameOrID(gInterfaceDefinitions[tToBeImplemented[tKey]]) + "::" +
									tKey + "()' IN CLASS '" + getClassNameOrID(pClass) +
									"' WAS FOUND IN EXTENSION CHAIN INSTEAD");
						}
						tToBeImplemented[tKey] = true;
					}
				}
			}
			if(tClass.EXTENDS)
				{tClass = getClassDefinition(tClass.EXTENDS);}
			else
				{tClass = null;}
		}

		for(var tKey in tToBeImplemented)
		{
			if(tToBeImplemented.hasOwnProperty(tKey) && (tToBeImplemented[tKey] !== true))
			{
				pErrors.push("MISSING FUNCTION IMPLEMENTATION IN CLASS '" + getClassNameOrID(pClass) +
						"' FOR '" + getInterfaceNameOrID(gInterfaceDefinitions[tToBeImplemented[tKey]]) + "::" +
						tKey + "()'");
			}
		}*/
		gCheckedClassAdherenceToInterfaces[pCompiledClass.CRX_CLASS_ID] = true;
	}
	function parseClass(pClass, pErrors, pWarnings, pVirtuals, pNonVirtuals, pVirtualFinalFunctions, pRemainingAbstractVirtuals)
	{
		var vClassNameOrID = getClassNameOrID(pClass);
		var vMembers = {};

		for(var tKey in pClass)
		{
			if(!pClass.hasOwnProperty(tKey))
				{continue;}

			if((tKey === "IMPLEMENTS") || (tKey === "EXTENDS") || (tKey === "CRX_DEFINITION") ||
					(tKey === "CRX_CLASS_ID") || (tKey === "CRX_CLASS_NAME"))
				{}
			else if((tKey === "PUBLIC") || (tKey === "PRIVATE") || (tKey === "PROTECTED"))
			{
				parseClass_scope(vClassNameOrID, pErrors, tKey, pClass[tKey], pVirtuals, pNonVirtuals, pVirtualFinalFunctions,
						pRemainingAbstractVirtuals, vMembers);
			}
			else
			{
				pErrors.push('UNRECOGINZED TOKEN "' + tKey + '" IN CLASS "' + vClassNameOrID + '"');
			}
		}
		
		if(pErrors.length === 0)
			{compileClass(pClass);}
	}
	function parseClass_scope(pClassNameOrID, pErrors, pScope, pClassStructure, pVirtuals, pNonVirtuals, pVirtualFinalFunctions,
			pRemainingAbstractVirtuals, pMembers)
	{
		if(pScope === 'PRIVATE')
		{
			for(var tKey in pClassStructure)
			{
				if(!pClassStructure.hasOwnProperty(tKey))
					{continue;}

				if(tKey === "VARS")
					{parseClass_vars(pClassNameOrID, pErrors, 'PRIVATE VARS', pClassStructure['VARS'], pVirtuals, pMembers);}
				else if(tKey === "FUNCTIONS")
				{
					parseClass_functions(pClassNameOrID, pErrors, 'PRIVATE FUNCTIONS',
							pClassStructure['FUNCTIONS'], pVirtuals, pNonVirtuals, pMembers);
				}
				else if(tKey === "STATIC")
					{parseClass_statics(pClassNameOrID, pErrors, 'PRIVATE STATIC', pClassStructure['STATIC'], pVirtuals, pNonVirtuals, pMembers);}
				else if(tKey === "VIRTUAL")
				{
					for(var tKey2 in pClassStructure["VIRTUAL"])
					{
						if(!pClassStructure["VIRTUAL"].hasOwnProperty(tKey2))
							{continue;}

						if(tKey2 === "FUNCTIONS")
						{
							parseClass_virtualFunctions(pClassNameOrID, pErrors, 'PRIVATE VIRTUAL FUNCTIONS',
									pClassStructure['VIRTUAL']['FUNCTIONS'], pVirtuals, pNonVirtuals, pVirtualFinalFunctions,
											pRemainingAbstractVirtuals, pMembers);
						}
						/*else if(tKey2 === "FINAL")
						{
							for(var tKey3 in pClassStructure["VIRTUAL"]["FINAL"])
							{
								if(!pClassStructure["VIRTUAL"]["FINAL"].hasOwnProperty(tKey3))
									{continue;}

								if(tKey3 === "FUNCTIONS")
								{
									parseClass_virtualFunctions(pClassNameOrID, pErrors, 'PRIVATE VIRTUAL FINAL FUNCTIONS',
											pClassStructure['VIRTUAL']["FINAL"]['FUNCTIONS'], pVirtuals, pNonVirtuals, pVirtualFinalFunctions,
											pRemainingAbstractVirtuals, pMembers);
								}
							}
						}*/
						else
							{pErrors.push('"PRIVATE VIRTUAL ' + tKey2 + '" IS NOT ALLOWED. FOUND IN CLASS "' + pClassNameOrID + '"');}
					}
				}
				else
					{pErrors.push('"PRIVATE ' + tKey + '" IS NOT ALLOWED. FOUND IN CLASS "' + pClassNameOrID + '"');}
			}
		}
		else if(pScope === 'PUBLIC')
		{
			for(var tKey in pClassStructure)
			{
				if(!pClassStructure.hasOwnProperty(tKey))
					{continue;}

				if(tKey === "VARS")
					{parseClass_vars(pClassNameOrID, pErrors, 'PUBLIC VARS', pClassStructure['VARS'], pVirtuals, pMembers);}
				else if(tKey === "FUNCTIONS")
				{
					parseClass_functions(pClassNameOrID, pErrors, 'PUBLIC FUNCTIONS', pClassStructure['FUNCTIONS'],
							pVirtuals, pNonVirtuals, pMembers);
				}
				else if(tKey === "STATIC")
					{parseClass_statics(pClassNameOrID, pErrors, 'PUBLIC STATIC', pClassStructure['STATIC'], pVirtuals, pNonVirtuals, pMembers);}
				else if(tKey === "CONSTRUCT")
				{
					isInvalidFunction(pErrors, pClassNameOrID, "PUBLIC", tKey,
							pClassStructure[tKey], false);
				}
				else if(tKey === "VIRTUAL")
				{
					for(var tKey2 in pClassStructure["VIRTUAL"])
					{
						if(!pClassStructure["VIRTUAL"].hasOwnProperty(tKey2))
							{continue;}

						if(tKey2 === "FUNCTIONS")
						{
							parseClass_virtualFunctions(pClassNameOrID, pErrors, 'PUBLIC VIRTUAL FUNCTIONS',
									pClassStructure['VIRTUAL']['FUNCTIONS'], pVirtuals, pNonVirtuals, pVirtualFinalFunctions, 
									pRemainingAbstractVirtuals, pMembers);
						}
						else if(tKey2 === "FINAL")
						{
							for(var tKey3 in pClassStructure["VIRTUAL"]["FINAL"])
							{
								if(!pClassStructure["VIRTUAL"]["FINAL"].hasOwnProperty(tKey3))
									{continue;}

								if(tKey3 === "FUNCTIONS")
								{
									parseClass_virtualFunctions(pClassNameOrID, pErrors, 'PUBLIC VIRTUAL FINAL FUNCTIONS',
											pClassStructure['VIRTUAL']["FINAL"]['FUNCTIONS'], pVirtuals, pNonVirtuals, pVirtualFinalFunctions,
											pRemainingAbstractVirtuals, pMembers);
								}
							}
						}
						else
							{pErrors.push('"PUBLIC VIRTUAL ' + tKey2 + '" IS NOT ALLOWED. FOUND IN CLASS "' + pClassNameOrID + '"');}
					}
				}
				else
					{pErrors.push('"PUBLIC ' + tKey + '" IS NOT ALLOWED. FOUND IN CLASS "' + pClassNameOrID + '"');}
			}
		}
		else if(pScope === 'PROTECTED')
		{
			for(var tKey in pClassStructure)
			{
				if(!pClassStructure.hasOwnProperty(tKey))
					{continue;}

				/*if(tKey === "VARS")
					{parseClass_vars(pClassNameOrID, pErrors, 'PROTECTED VARS', pClassStructure['VARS'], pVirtuals, pMembers);}*/
				if(tKey === "FUNCTIONS")
				{
					parseClass_functions(pClassNameOrID, pErrors, 'PROTECTED FUNCTIONS', pClassStructure['FUNCTIONS'],
							pVirtuals, pNonVirtuals, pMembers);
				}
				else if(tKey === "VIRTUAL")
				{
					for(var tKey2 in pClassStructure["VIRTUAL"])
					{
						if(!pClassStructure["VIRTUAL"].hasOwnProperty(tKey2))
							{continue;}

						if(tKey2 === "FUNCTIONS")
						{
							parseClass_virtualFunctions(pClassNameOrID, pErrors, 'PROTECTED VIRTUAL FUNCTIONS',
									pClassStructure['VIRTUAL']['FUNCTIONS'], pVirtuals, pNonVirtuals, pVirtualFinalFunctions,
									pRemainingAbstractVirtuals, pMembers);
						}
						else if(tKey2 === "FINAL")
						{
							for(var tKey3 in pClassStructure["VIRTUAL"]["FINAL"])
							{
								if(!pClassStructure["VIRTUAL"]["FINAL"].hasOwnProperty(tKey3))
									{continue;}

								if(tKey3 === "FUNCTIONS")
								{
									parseClass_virtualFunctions(pClassNameOrID, pErrors, 'PROTECTED VIRTUAL FINAL FUNCTIONS',
											pClassStructure['VIRTUAL']["FINAL"]['FUNCTIONS'], pVirtuals, pNonVirtuals, pVirtualFinalFunctions,
											pRemainingAbstractVirtuals, pMembers);
								}
							}
						}
						else
							{pErrors.push('"PROTECTED VIRTUAL ' + tKey2 + '" IS NOT ALLOWED. FOUND IN CLASS "' + pClassNameOrID + '"');}
					}
				}
				else
					{pErrors.push('"PROTECTED ' + tKey + '" IS NOT ALLOWED. FOUND IN CLASS "' + pClassNameOrID + '"');}
			}
		}
	}
	function parseClass_vars(pClassNameOrID, pErrors, pScope, pClassStructure, pVirtuals, pMembers)
	{
		for(var tKey in pClassStructure)
		{
			if(!pClassStructure.hasOwnProperty(tKey) ||
					isIllegalClassMemberName(pErrors, pClassNameOrID, pScope, tKey))
				{continue;}

			checkDuplicateMember(pErrors, pClassNameOrID, tKey, pMembers);

			if(pVirtuals.hasOwnProperty(tKey))
				{pErrors.push(pClassNameOrID + "::" + tKey + "=>" + 'MEMBER ALREADY DECLARED AS VIRTUAL IN BASE CLASSES');}
		}
	}
	function parseClass_functions(pClassNameOrID, pErrors, pScope, pClassStructure, pVirtuals, pNonVirtuals, pMembers)
	{
		var vIsStatic = (pScope.indexOf("STATIC") > -1);
		var vIsProtected = (pScope.indexOf("PROTECTED") > -1);

		for(var tKey in pClassStructure)
		{
			if(!pClassStructure.hasOwnProperty(tKey) ||
					isIllegalClassMemberName(pErrors, pClassNameOrID, pScope, tKey) ||
					isInvalidFunction(pErrors, pClassNameOrID, pScope, tKey,
					pClassStructure[tKey], false))
				{continue;}

			if(!vIsStatic)
			{
				if(pVirtuals.hasOwnProperty(tKey))
						{pErrors.push(pClassNameOrID + "::" + tKey + "=>" + 'MEMBER MUST BE DECLARED VIRTUAL. SEE BASE CLASSES.');}
				pNonVirtuals[tKey] = true;
			}

			checkDuplicateMember(pErrors, pClassNameOrID, tKey, pMembers);
		}
	}
	function parseClass_virtualFunctions(pClassNameOrID, pErrors, pScope, pClassStructure, pVirtuals, pNonVirtuals, pVirtualFinalFunctions, 
			pRemainingAbstractVirtuals, pMembers)
	{
		var vAreFinals = (pScope.indexOf("FINAL") > -1);

		for(var tKey in pClassStructure)
		{
			if(!pClassStructure.hasOwnProperty(tKey) ||
					isIllegalClassMemberName(pErrors, pClassNameOrID, pScope, tKey) ||
					isInvalidFunction(pErrors, pClassNameOrID, pScope, tKey,
					pClassStructure[tKey], true))
				{continue;}

			if(pNonVirtuals.hasOwnProperty(tKey))
			{
				pErrors.push(pClassNameOrID + "::" + tKey + "=>" +
						'MEMBER MUST BE DECLARED AS NON VIRTUAL. SEE BASE CLASSES');
			}
			pVirtuals[tKey] = true;

			checkDuplicateMember(pErrors, pClassNameOrID, tKey, pMembers);

			if(pVirtualFinalFunctions.hasOwnProperty(tKey))
			{
				pErrors.push(pClassNameOrID + "::" + tKey + "=>" +
						'CAN NOT OVERRIDE VIRTUAL MEMBER. MEMBER ALREADY DECLARED FINAL IN BASE CLASS "' + 
						pVirtualFinalFunctions[tKey] + '"');
			}

			if(vAreFinals)
			{
				if(pClassStructure[tKey] === 0)
				{
					pErrors.push(pClassNameOrID + "::" + tKey + "=>" +
							'AN ABSTRACT VIRTUAL FUNCTION, CAN NOT BE DECLARED FINAL');
				}
				else
				{
					if(pRemainingAbstractVirtuals.p[tKey])
					{
						delete pRemainingAbstractVirtuals.p[tKey];
						pRemainingAbstractVirtuals.length--;
					}

					pVirtualFinalFunctions[tKey] = pClassNameOrID;
				}
			}
			else
			{
				if(pClassStructure[tKey] === 0)
				{
					if(!pRemainingAbstractVirtuals.p[tKey])
					{
						pRemainingAbstractVirtuals.p[tKey] = true;
						pRemainingAbstractVirtuals.length++;
					}
				}
				else if(pRemainingAbstractVirtuals.p[tKey])
				{
					delete pRemainingAbstractVirtuals.p[tKey];
					pRemainingAbstractVirtuals.length--;
				}
			}
		}
	}
	function parseClass_statics(pClassNameOrID, pErrors, pScope, pClassStructure, pVirtuals, pNonVirtuals, pMembers)
	{
		for(var tKey in pClassStructure)
		{
			if(!pClassStructure.hasOwnProperty(tKey))
				{continue;}

			if((tKey !== "VARS") && (tKey !== "FUNCTIONS"))
			{
				pErrors.push(pClassNameOrID + "::" + tKey + "=>" +
						'"' + pScope + " " + tKey + '" IS NOT ALLOWED');
			}
			else if(tKey === "VARS")
				{parseClass_vars(pClassNameOrID, pErrors, pScope + ' VARS', pClassStructure['VARS'], pVirtuals, pMembers);}
			else if(tKey === "FUNCTIONS")
			{
				if(gIS_STRICT_JS)
				{
					pErrors.push(pClassNameOrID + "::" + tKey + "=>" + '"' + pScope + " " + 
							'FUNCTIONS" IS NOT ALLOWED; RUNNING IN STRICT JS MODE OR STATIC FUNCTIONS CAN NOT ' +
							"BE SUPPORTED IN THIS BROWSER");
				}
				else
				{
					parseClass_functions(pClassNameOrID, pErrors, pScope + ' FUNCTIONS', pClassStructure['FUNCTIONS'], pVirtuals, pNonVirtuals,
							pMembers);
				}
			}
		}
	}
	function buildInterface(pInterface, pErrors, pWarnings)
	{
		if(gInterfaceBuilds.hasOwnProperty(pInterface.CRX_INTERFACE_ID))
			{return;}

		var vFunctions = {};

		gInterfaceBuilds[pInterface.CRX_INTERFACE_ID] = {"functions": {}, "trace": {},  "fullTrace": {}};

		if(pInterface.hasOwnProperty("INHERITS"))
		{
			if(getType(pInterface["INHERITS"]) !== "array")
			{
				pErrors.push("'INHERITS' DEFINITION FOR INTERFACE '" + getInterfaceNameOrID(pInterface) +
						"' IS NOT AN ARRAY");
			}
			else
			{
				for(var tI = 0; tI < pInterface["INHERITS"].length; tI++)
				{
					var tInterface = getInterface(pInterface["INHERITS"][tI]);
					
					if(tInterface === null)
						{halt('MISSING DEFINITION FOR THE INTERFACE THAT IS INHERITED BY INTERFACE "' + getInterfaceNameOrID(pInterface) + '"');}

					buildInterface(tInterface, pErrors, pWarnings);

					if(gInterfaceBuilds[tInterface.CRX_INTERFACE_ID]["fullTrace"] &&
							gInterfaceBuilds[tInterface.CRX_INTERFACE_ID]["fullTrace"].
							hasOwnProperty(pInterface.CRX_INTERFACE_ID))
					{
						halt("CIRCULAR INHERITANCE IN INTERFACE '" +
								getInterfaceNameOrID(pInterface) + "' WITH INTERFACE '" +
								getInterfaceNameOrID(tInterface));
					}

					gInterfaceBuilds[pInterface.CRX_INTERFACE_ID]["trace"][tInterface.CRX_INTERFACE_ID] =
							tInterface;
					gInterfaceBuilds[pInterface.CRX_INTERFACE_ID]["fullTrace"][tInterface.CRX_INTERFACE_ID] =
							tInterface;

					for(var tKey in gInterfaceBuilds[tInterface.CRX_INTERFACE_ID].fullTrace)
					{
						if(!gInterfaceBuilds[tInterface.CRX_INTERFACE_ID].fullTrace.hasOwnProperty(tKey))
							{continue;}

						gInterfaceBuilds[pInterface.CRX_INTERFACE_ID].
								fullTrace[tKey] = gInterfaceBuilds[tInterface.CRX_INTERFACE_ID].fullTrace[tKey];
					}
				}
			}
		}

		for(var tKey in gInterfaceBuilds[pInterface.CRX_INTERFACE_ID].trace)
		{
			if(!gInterfaceBuilds[pInterface.CRX_INTERFACE_ID].trace.hasOwnProperty(tKey))
				{continue;}

			for(var tKey2 in gInterfaceBuilds[tKey].functions)
			{
				if(!gInterfaceBuilds[tKey].functions.hasOwnProperty(tKey2))
					{continue;}

				if(gInterfaceBuilds[pInterface.CRX_INTERFACE_ID].functions.hasOwnProperty(tKey2))
				{
					pErrors.push("INTERFACE FUNCTION '" +
							getInterfaceNameOrID(gInterfaceDefinitions[gInterfaceBuilds[tKey].functions[tKey2]]) +
							"::" + tKey2 + "' ALSO DEFINED IN INTERFACE '" + 
							getInterfaceNameOrID(gInterfaceDefinitions[
							gInterfaceBuilds[pInterface.CRX_INTERFACE_ID].functions[tKey2]]) +
							 "'");
				}
				else
				{
					gInterfaceBuilds[pInterface.CRX_INTERFACE_ID].functions[tKey2] = 
							gInterfaceBuilds[tKey].functions[tKey2];
				}
			}
		}

		for(var tKey in pInterface)
		{
			if(!pInterface.hasOwnProperty(tKey) || (tKey === "CRX_INTERFACE_ID") ||
					(tKey === "CRX_INTERFACE_NAME") || (tKey === "INHERITS") ||
					(tKey === "CRX_DEFINITION"))
				{continue;}

			if(isIllegalClassMemberName(tKey))
			{
				pErrors.push("ILEGAL USE OF KEYWORD '" + tKey + "' IN INTERFACE '" +
						getInterfaceNameOrID(pInterface) + "'");
				continue;
			}
			else
			{
				if(gInterfaceBuilds[pInterface.CRX_INTERFACE_ID].functions.hasOwnProperty(tKey))
				{
					pErrors.push("INTERFACE FUNCTION '" + 
							getInterfaceNameOrID(gInterfaceDefinitions[pInterface.CRX_INTERFACE_ID]) +
							"::" + tKey + "' ALSO DEFINED IN INTERFACE '" +
							getInterfaceNameOrID(gInterfaceDefinitions[
							gInterfaceBuilds[pInterface.CRX_INTERFACE_ID].functions[tKey]])	 +
							"'");
				}

				gInterfaceBuilds[pInterface.CRX_INTERFACE_ID].functions[tKey] = pInterface.CRX_INTERFACE_ID;
			}
		}
	}
	function isIllegalClassMemberName(pErrors, pClassNameOrID, pSectionName, pMemberName)
	{
		if((pMemberName === "PUBLIC") || (pMemberName === "PRIVATE") || (pMemberName === "PROTECTED") ||
				(pMemberName === "CONSTRUCT") || (pMemberName === "VIRTUAL") ||
				(pMemberName === "IMPLEMENTS") || (pMemberName === "CONST") ||
				(pMemberName === "PARENT") || (pMemberName === "STATIC") ||
				(pMemberName === "CRX_CLASS_INFO") || (pMemberName === "CAST") ||
				(pMemberName === "SELF") || (pMemberName === "VARS") || (pMemberName === "FUNCTIONS") ||
				(pMemberName === "VAR") || (pMemberName === "FUNCTION") || (pMemberName === "SR") ||
				(pMemberName === "CRX_CLASS_ID") ||(pMemberName === "O") ||
				(pMemberName === "CRX_DEFINITION") || (pMemberName === "FINAL"))
		{
			pErrors.push("ILEGAL USE OF KEYWORD '" + pMemberName + "' IN CLASS '" +
					pClassNameOrID + "' IN SECTION " + "[" + pSectionName + "]");

			return true;
		}
		return false;
	}
	function isInvalidFunction(pErrors, pClassNameOrID, pSectionName, pMemberName, pMember, pIsVirtual)
	{
		if((typeof(pMember) !== 'function') && (!pIsVirtual || (pMember !== 0)))
		{
			pErrors.push(pClassNameOrID + "::" + pMemberName + "=>" + '"' + pSectionName + '" MUST BE A FUNCTION');
			return true;
		}
		return false;
	}
	function checkDuplicateMember(pErrors, pClassNameOrID, pKey, pMembers)
	{
		if(pMembers.hasOwnProperty(pKey))
			{pErrors.push('DUPLICATE MEMBER "' + pKey + '" FOUND IN CLASS "' + pClassNameOrID + '"');}
		else
			{pMembers[pKey] = true;}
	}
	function compileClass(pClass)
	{
		if(gCompiledClasses[pClass.CRX_CLASS_ID])
			{return;}
		
		var vCompiledClass = 
		{
			EXTENDS: null,
			IMPLEMENTES: null,
			PUBLIC: null,
			PRIVATE: null,
			PROTECTED: null
		};
		var tKey = null;
		var vClassMemberScopes = 
		{
			PUBLIC: {},
			PRIVATE: {},
			PROTECTED: {}
		};
		var vClassMemberTypes = //USES 1 FOR INSTANCE MEMBER.  2 FOR VIRTUAL.  3 FOR ABSTRACT VIRTUAL. 4 FOR STATIC MEMBER.
		{
			VARS: {},
			FUNCTIONS: {}
		};
		
		vCompiledClass.CRX_CLASS_ID = pClass.CRX_CLASS_ID;
		if(pClass.hasOwnProperty("EXTENDS"))
			{vCompiledClass.EXTENDS = gCompiledClasses[getClassID(pClass["EXTENDS"])];}
		if(pClass.hasOwnProperty("IMPLEMENTS"))
			{vCompiledClass.IMPLEMENTS = pClass["IMPLEMENTS"];}
		if(pClass.hasOwnProperty("PUBLIC"))
		{
			vCompiledClass.PUBLIC_VARS = [];
			vCompiledClass.PUBLIC_FUNCTIONS = [];
			vCompiledClass.PUBLIC_VIRTUAL = null;
			vCompiledClass.PUBLIC_VIRTUAL_FUNCTIONS = [];
			vCompiledClass.PUBLIC_CONSTRUCT = null;

			if(pClass["PUBLIC"].hasOwnProperty("VARS"))
			{
				for(tKey in pClass["PUBLIC"]["VARS"])
				{
					if(pClass["PUBLIC"]["VARS"].hasOwnProperty(tKey))
					{
						vCompiledClass.PUBLIC_VARS.push(crxOop_var([tKey, pClass["PUBLIC"]["VARS"][tKey]]));
						vClassMemberScopes.PUBLIC[tKey] = true;
						vClassMemberTypes.VARS[tKey] = 1;
					}
				}
			}
			if(pClass["PUBLIC"].hasOwnProperty("FUNCTIONS"))
			{
				for(tKey in pClass["PUBLIC"]["FUNCTIONS"])
				{
					if(pClass["PUBLIC"]["FUNCTIONS"].hasOwnProperty(tKey))
					{
						vCompiledClass.PUBLIC_FUNCTIONS.push([tKey, pClass["PUBLIC"]["FUNCTIONS"][tKey]]);
						vClassMemberScopes.PUBLIC[tKey] = true;
						vClassMemberTypes.FUNCTIONS[tKey] = 1;
					}
				}
			}
			if(pClass["PUBLIC"].hasOwnProperty("VIRTUAL"))
			{
				if(pClass["PUBLIC"]["VIRTUAL"].hasOwnProperty("FUNCTIONS"))
				{
					for(tKey in pClass["PUBLIC"]["VIRTUAL"]["FUNCTIONS"])
					{
						if(pClass["PUBLIC"]["VIRTUAL"]["FUNCTIONS"].hasOwnProperty(tKey))
						{
							vCompiledClass.PUBLIC_VIRTUAL_FUNCTIONS.push([tKey, pClass["PUBLIC"]["VIRTUAL"]["FUNCTIONS"][tKey]]);

							if((pClass["PUBLIC"]["VIRTUAL"]["FUNCTIONS"][tKey] !== 0))
								{vClassMemberTypes.FUNCTIONS[tKey] = 2;}
							else
								{vClassMemberTypes.FUNCTIONS[tKey] = 3;}

							vClassMemberScopes.PUBLIC[tKey] = true;
						}
					}
				}
				if(pClass["PUBLIC"]["VIRTUAL"].hasOwnProperty("FINAL") && 
						pClass["PUBLIC"]["VIRTUAL"]["FINAL"].hasOwnProperty("FUNCTIONS"))
				{
					for(tKey in pClass["PUBLIC"]["VIRTUAL"]["FINAL"]["FUNCTIONS"])
					{
						if(pClass["PUBLIC"]["VIRTUAL"]["FINAL"]["FUNCTIONS"].hasOwnProperty(tKey))
						{
							vCompiledClass.PUBLIC_VIRTUAL_FUNCTIONS.push([tKey, pClass["PUBLIC"]["VIRTUAL"]["FINAL"]["FUNCTIONS"][tKey]]);
							vClassMemberScopes.PUBLIC[tKey] = true;
							vClassMemberTypes.FUNCTIONS[tKey] = 2;
						}
					}
				}
				if(vCompiledClass.PUBLIC_VIRTUAL_FUNCTIONS.length > 0)
						{vCompiledClass.PUBLIC_VIRTUAL = true;}
			}
			if(pClass["PUBLIC"].hasOwnProperty("CONSTRUCT"))
				{vCompiledClass.PUBLIC_CONSTRUCT = pClass["PUBLIC"]["CONSTRUCT"];}
			if((vCompiledClass.PUBLIC_VARS.length > 0) || (vCompiledClass.PUBLIC_FUNCTIONS.length > 0) ||
					(vCompiledClass.PUBLIC_VIRTUAL) || (vCompiledClass.PUBLIC_CONSTRUCT))
				{vCompiledClass.PUBLIC = true;}
		}
		if(pClass.hasOwnProperty("PRIVATE"))
		{
			vCompiledClass.PRIVATE_VARS = [];
			vCompiledClass.PRIVATE_FUNCTIONS = [];
			vCompiledClass.PRIVATE_VIRTUAL = null;
			vCompiledClass.PRIVATE_VIRTUAL_FUNCTIONS = [];

			if(pClass["PRIVATE"].hasOwnProperty("VARS"))
			{
				for(tKey in pClass["PRIVATE"]["VARS"])
				{
					if(pClass["PRIVATE"]["VARS"].hasOwnProperty(tKey))
					{
						vCompiledClass.PRIVATE_VARS.push(crxOop_var([tKey, pClass["PRIVATE"]["VARS"][tKey]]));
						vClassMemberScopes.PRIVATE[tKey] = true;
						vClassMemberTypes.VARS[tKey] = 1;
					}
				}
			}
			if(pClass["PRIVATE"].hasOwnProperty("FUNCTIONS"))
			{
				for(tKey in pClass["PRIVATE"]["FUNCTIONS"])
				{
					if(pClass["PRIVATE"]["FUNCTIONS"].hasOwnProperty(tKey))
					{
						vCompiledClass.PRIVATE_FUNCTIONS.push([tKey, pClass["PRIVATE"]["FUNCTIONS"][tKey]]);
						vClassMemberScopes.PRIVATE[tKey] = true;
						vClassMemberTypes.FUNCTIONS[tKey] = 1;
					}
				}
			}
			if(pClass["PRIVATE"].hasOwnProperty("VIRTUAL"))
			{
				if(pClass["PRIVATE"]["VIRTUAL"].hasOwnProperty("FUNCTIONS"))
				{
					for(tKey in pClass["PRIVATE"]["VIRTUAL"]["FUNCTIONS"])
					{
						if(pClass["PRIVATE"]["VIRTUAL"]["FUNCTIONS"].hasOwnProperty(tKey))
						{
							vCompiledClass.PRIVATE_VIRTUAL_FUNCTIONS.push([tKey, pClass["PRIVATE"]["VIRTUAL"]["FUNCTIONS"][tKey]]);

							if((pClass["PRIVATE"]["VIRTUAL"]["FUNCTIONS"][tKey] !== 0))
								{vClassMemberTypes.FUNCTIONS[tKey] = 2;}
							else
								{vClassMemberTypes.FUNCTIONS[tKey] = 3;}

							vClassMemberScopes.PRIVATE[tKey] = true;
						}
					}
				}
				if(pClass["PRIVATE"]["VIRTUAL"].hasOwnProperty("FINAL") && 
						pClass["PRIVATE"]["VIRTUAL"]["FINAL"].hasOwnProperty("FUNCTIONS"))
				{
					for(tKey in pClass["PRIVATE"]["VIRTUAL"]["FINAL"]["FUNCTIONS"])
					{
						if(pClass["PRIVATE"]["VIRTUAL"]["FINAL"]["FUNCTIONS"].hasOwnProperty(tKey))
						{
							vCompiledClass.PRIVATE_VIRTUAL_FUNCTIONS.push([tKey, pClass["PRIVATE"]["VIRTUAL"]["FINAL"]["FUNCTIONS"][tKey]]);
							vClassMemberScopes.PRIVATE[tKey] = true;
							vClassMemberTypes.FUNCTIONS[tKey] = 2;
						}
					}
				}
				if(vCompiledClass.PRIVATE_VIRTUAL_FUNCTIONS.length > 0)
						{vCompiledClass.PRIVATE_VIRTUAL = true;}
			}
			if((vCompiledClass.PRIVATE_VARS.length > 0) || (vCompiledClass.PRIVATE_FUNCTIONS.length > 0) ||
					vCompiledClass.PRIVATE_VIRTUAL)
				{vCompiledClass.PRIVATE = true;}
		}
		if(pClass.hasOwnProperty("PROTECTED"))
		{
			//vCompiledClass.PROTECTED_VARS = [];
			vCompiledClass.PROTECTED_FUNCTIONS = [];
			vCompiledClass.PROTECTED_VIRTUAL = null;
			vCompiledClass.PROTECTED_VIRTUAL_FUNCTIONS = [];

			/*if(pClass["PROTECTED"].hasOwnProperty("VARS"))
			{
				for(tKey in pClass["PROTECTED"]["VARS"])
				{
					if(pClass["PROTECTED"]["VARS"].hasOwnProperty(tKey))
						{vCompiledClass.PROTECTED_VARS.push(crxOop_var([tKey, pClass["PROTECTED"]["VARS"][tKey]]));}
				}
			}*/
			if(pClass["PROTECTED"].hasOwnProperty("FUNCTIONS"))
			{
				for(tKey in pClass["PROTECTED"]["FUNCTIONS"])
				{
					if(pClass["PROTECTED"]["FUNCTIONS"].hasOwnProperty(tKey))
					{
						vCompiledClass.PROTECTED_FUNCTIONS.push([tKey, pClass["PROTECTED"]["FUNCTIONS"][tKey]]);
						vClassMemberScopes.PROTECTED[tKey] = true;
						vClassMemberTypes.FUNCTIONS[tKey] = 1;
					}
				}
			}
			if(pClass["PROTECTED"].hasOwnProperty("VIRTUAL"))
			{
				if(pClass["PROTECTED"]["VIRTUAL"].hasOwnProperty("FUNCTIONS"))
				{
					for(tKey in pClass["PROTECTED"]["VIRTUAL"]["FUNCTIONS"])
					{
						if(pClass["PROTECTED"]["VIRTUAL"]["FUNCTIONS"].hasOwnProperty(tKey))
						{
							vCompiledClass.PROTECTED_VIRTUAL_FUNCTIONS.push([tKey, pClass["PROTECTED"]["VIRTUAL"]["FUNCTIONS"][tKey]]);

							if((pClass["PROTECTED"]["VIRTUAL"]["FUNCTIONS"][tKey] !== 0))
								{vClassMemberTypes.FUNCTIONS[tKey] = 2;}
							else
								{vClassMemberTypes.FUNCTIONS[tKey] = 3;}

							vClassMemberScopes.PROTECTED[tKey] = true;
						}
					}
				}
				if(pClass["PROTECTED"]["VIRTUAL"].hasOwnProperty("FINAL") && 
						pClass["PROTECTED"]["VIRTUAL"]["FINAL"].hasOwnProperty("FUNCTIONS"))
				{
					for(tKey in pClass["PROTECTED"]["VIRTUAL"]["FINAL"]["FUNCTIONS"])
					{
						if(pClass["PROTECTED"]["VIRTUAL"]["FINAL"]["FUNCTIONS"].hasOwnProperty(tKey))
						{
							vCompiledClass.PROTECTED_VIRTUAL_FUNCTIONS.push([tKey, pClass["PROTECTED"]["VIRTUAL"]["FINAL"]["FUNCTIONS"][tKey]]);
							vClassMemberScopes.PROTECTED[tKey] = true;
							vClassMemberTypes.FUNCTIONS[tKey] = 2;
						}
					}
				}
				if(vCompiledClass.PROTECTED_VIRTUAL_FUNCTIONS.length > 0)
						{vCompiledClass.PROTECTED_VIRTUAL = true;}
			}
			if(/*(vCompiledClass.PROTECTED_VARS.length > 0) ||*/ (vCompiledClass.PROTECTED_FUNCTIONS.length > 0) ||
					(vCompiledClass.PROTECTED_VIRTUAL))
				{vCompiledClass.PROTECTED = true;}
		}
		gCompiledClasses[pClass.CRX_CLASS_ID] = vCompiledClass;
		gClassMemberScopes[pClass.CRX_CLASS_ID] = vClassMemberScopes;
		gClassMemberTypes[pClass.CRX_CLASS_ID] = vClassMemberTypes;
	}
	function buildVFTable(pCompiledClass)
		{_buildVFTable(pCompiledClass.CRX_CLASS_ID, pCompiledClass);}
	function _buildVFTable(pBaseClassId, pCompiledClass)
	{
		if(pCompiledClass.EXTENDS)
			{_buildVFTable(pBaseClassId, pCompiledClass.EXTENDS);}

		for(var tI = 0; tI < _buildVFTable.KEYS.length; tI++)
		{
			if(pCompiledClass[_buildVFTable.KEYS[tI][0]] && pCompiledClass[_buildVFTable.KEYS[tI][1]])
			{
				if(!gClassVTables[pBaseClassId])
				{
					gClassVTables[pBaseClassId] = {};
					gClassVTables_firstOccurances[pBaseClassId] = {};
					gClassVTables_lastOccurances[pBaseClassId] = {};
				}

				for(var tI2 =  pCompiledClass[_buildVFTable.KEYS[tI][2]].length - 1; tI2 > -1; tI2--)
				{
					if(pCompiledClass[_buildVFTable.KEYS[tI][2]][tI2][1] !== 0)
					{
						gClassVTables[pBaseClassId][pCompiledClass[_buildVFTable.KEYS[tI][2]][tI2][0]] =
								pCompiledClass[_buildVFTable.KEYS[tI][2]][tI2][1];

						
					}
					gClassVTables_lastOccurances[pBaseClassId][pCompiledClass[_buildVFTable.KEYS[tI][2]][tI2][0]] =
								pCompiledClass.CRX_CLASS_ID;
					//if(pCompiledClass[_buildVFTable.KEYS[tI][2]][tI2][1] !== 0)
					//{
					if(!gClassVTables_firstOccurances[pBaseClassId][pCompiledClass[_buildVFTable.KEYS[tI][2]][tI2][0]])
						{gClassVTables_firstOccurances[pBaseClassId][pCompiledClass[_buildVFTable.KEYS[tI][2]][tI2][0]] = pCompiledClass.CRX_CLASS_ID;}
					//}
				}
			}
		}
	}
	_buildVFTable.KEYS = 
	[
		["PUBLIC", "PUBLIC_VIRTUAL", "PUBLIC_VIRTUAL_FUNCTIONS"],
		["PRIVATE", "PRIVATE_VIRTUAL", "PRIVATE_VIRTUAL_FUNCTIONS"],
		["PROTECTED", "PROTECTED_VIRTUAL", "PROTECTED_VIRTUAL_FUNCTIONS"]
	]
	function buildStatics(pClass)
	{
		if(gClassPublicStatics[pClass.CRX_CLASS_ID] === undefined)
		{
			if(pClass.hasOwnProperty("PUBLIC") && pClass['PUBLIC'].hasOwnProperty("STATIC"))
			{
				gClassPublicStatics[pClass.CRX_CLASS_ID] = {};

				if(pClass["PUBLIC"]["STATIC"].hasOwnProperty("VARS"))
				{
					for(var tKey in pClass["PUBLIC"]["STATIC"]["VARS"])
					{
						if(!pClass["PUBLIC"]["STATIC"]["VARS"].hasOwnProperty(tKey))
							{continue;}

						gClassPublicStatics[pClass.CRX_CLASS_ID][tKey] =
								pClass["PUBLIC"]["STATIC"]["VARS"][tKey];
					}
				}
				if(!gIS_STRICT_JS && pClass["PUBLIC"]["STATIC"].hasOwnProperty("FUNCTIONS"))
				{
					for(var tKey in pClass["PUBLIC"]["STATIC"]["FUNCTIONS"])
					{
						if(!pClass["PUBLIC"]["STATIC"]["FUNCTIONS"].hasOwnProperty(tKey))
							{continue;}

						gClassPublicStatics[pClass.CRX_CLASS_ID][tKey] =
								static_call(pClass.CRX_CLASS_ID, pClass["PUBLIC"]["STATIC"]["FUNCTIONS"][tKey]);
					}
				}
			}
			else
				{gClassPublicStatics[pClass.CRX_CLASS_ID] = null;}

			if(pClass.hasOwnProperty("PRIVATE") && pClass['PRIVATE'].hasOwnProperty("STATIC"))
			{
				if(gClassPublicStatics[pClass.CRX_CLASS_ID] === null)
					{gClassPrivateStatics[pClass.CRX_CLASS_ID] = {};}
				else
				{
					gClassPrivateStatics[pClass.CRX_CLASS_ID] =
							gFunc_createObject(gClassPublicStatics[pClass.CRX_CLASS_ID]);
				}
				if(pClass["PRIVATE"]["STATIC"].hasOwnProperty("VARS"))
				{
					for(var tKey in pClass["PRIVATE"]["STATIC"]["VARS"])
					{
						if(!pClass["PRIVATE"]["STATIC"]["VARS"].hasOwnProperty(tKey))
							{continue;}

						gClassPrivateStatics[pClass.CRX_CLASS_ID][tKey] =
								pClass["PRIVATE"]["STATIC"]["VARS"][tKey];
					}
				}
				if(!gIS_STRICT_JS && pClass["PRIVATE"]["STATIC"].hasOwnProperty("FUNCTIONS"))
				{
					for(var tKey in pClass["PRIVATE"]["STATIC"]["FUNCTIONS"])
					{
						if(!pClass["PRIVATE"]["STATIC"]["FUNCTIONS"].hasOwnProperty(tKey))
							{continue;}

						setObjectReadOnlyMember(gClassPrivateStatics[pClass.CRX_CLASS_ID],
								tKey, static_call(pClass.CRX_CLASS_ID, pClass["PRIVATE"]["STATIC"]["FUNCTIONS"][tKey]));
					}
				}
			}
			else
				{gClassPrivateStatics[pClass.CRX_CLASS_ID] = null;}
		}
	}
	
	function _cast(pClassDefinitionOrClassName)
	{
		if(gIsHalted){return;}

		var vClassID = getClassID(pClassDefinitionOrClassName);

		if(vClassID === null)
			{return null;}

		return (getClassInfoObject(this).CRX_OBJECT_SEGMENTS[vClassID] || null);
	}
	function _static(pClassDefinitionOrClassName)
	{
		if(gIsHalted){return;}

		var vClass = getClassDefinition(pClassDefinitionOrClassName);

		if(vClass === null)
			{return null;}
		prepareClass(vClass);

		if(gClassPublicStatics[vClass.CRX_CLASS_ID])
			{return (gClassPublicStatics[vClass.CRX_CLASS_ID] || null);}
		else
			{return null;}
	}
	function _sr(pClassDefinitionOrClassName, pMemberName)
	{
		if(gIsHalted){return;}

		var vClassID = null;
		var vObject = null;
		var vClassInfoObject = null;

		if((pClassDefinitionOrClassName !== undefined) && (pClassDefinitionOrClassName !== null))
		{
			vClassID = getClassID(pClassDefinitionOrClassName);
			vObject = this.CAST(pClassDefinitionOrClassName);
		}
		else
		{
			vClassID = getObjectClassID(this.PARENT);
			vObject = this.PARENT;
		}

		if(!vClassID)
			{halt('UNDECLARED CLASS "??' + vObject + '??"');}
		if(!vObject)
		{
			halt('CAN NOT CALL VIRTUAL FUNCTION "' + pMemberName + '" ON CLASS "' +
					getClassNameOrID(gClassDefinitions[vClassID]) + '" INSTANCE CAN NOT BE CASTED TO "' +
					getClassNameOrID(gClassDefinitions[vClassID]) + '"');
		}

		if(getObjectClassIDFast(this) === vClassID)
		{
			if(gClassMemberTypes[vClassID].VARS[pMemberName])
				{return this[pMemberName];}
			else if(gClassMemberTypes[vClassID].FUNCTIONS[pMemberName])
			{
				if(gClassMemberTypes[vClassID].FUNCTIONS[pMemberName] === 1)
					{return this[pMemberName].apply(this, Array.prototype.slice.call(arguments, 2));}
				else if(gClassMemberTypes[vClassID].FUNCTIONS[pMemberName] === 2)
				{
					var tFunction = ftable_this_call__virtualPublic(vClassID, "puv", pMemberName);

					return tFunction.apply(vObject, Array.prototype.slice.call(arguments, 2));
				}
			}
		}
		else if(gClassMemberTypes[vClassID].VARS[pMemberName])
		{
			if(gClassMemberScopes[vClassID].PUBLIC[pMemberName])
			{
				if(arguments.length === 2)
					{return vObject[pMemberName];}
				else if(arguments.length === 3)
					{vObject[pMemberName] = arguments[2]; return;}
			}
		}
		else if(gClassMemberTypes[vClassID].FUNCTIONS[pMemberName])
		{
			if(gClassMemberTypes[vClassID].FUNCTIONS[pMemberName] === 1)
			{
				if(gClassMemberScopes[vClassID].PUBLIC[pMemberName])
					{return vObject[pMemberName].apply(vObject, Array.prototype.slice.call(arguments, 2));}
				else if(gClassMemberScopes[vClassID].PROTECTED[pMemberName])
				{
					var tClassInfoObject = getClassInfoObject(this);
					var tClassID = getObjectClassIDGivenClassInfoObject(this.THIS, tClassInfoObject);
					var tObject = this.PARENT;
					
					if((this === tClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[tClassID]) ||
							(!gIS_STRICT_JS && (gStaticContext[0] === tClassID) && (gStaticContext[1] === _sr.caller)))
					{
						return vObject[pMemberName].apply(tClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[vClassID],
								Array.prototype.slice.call(arguments, 2));
					}
				}
			}
			else if(gClassMemberTypes[vClassID].FUNCTIONS[pMemberName] === 2)
			{
				if(!gClassMemberScopes[vClassID].PRIVATE[pMemberName])
				{
					var tClassInfoObject = getClassInfoObject(this);
					var tClassID = getObjectClassIDGivenClassInfoObject(this.THIS, tClassInfoObject);
					var tObject = this.PARENT;
					var tIsFunctionProtected = false;
					var tIsCallerAllowedProtectedAccess = false;
					
					if((this === tClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[tClassID]) ||
							(!gIS_STRICT_JS && (gStaticContext[0] === tClassID) && (gStaticContext[1] === _sr.caller)))
						{tIsCallerAllowedProtectedAccess = true;}

					while(tObject !== null)
					{
						tClassID = getObjectClassIDFast(tObject);

						if(gClassMemberTypes[tClassID].FUNCTIONS[pMemberName]) //SHOULD ALWAYS EQUAL 2 OR 3
						{
							if(gClassMemberScopes[tClassID].PROTECTED[pMemberName] || 
									gClassMemberScopes[tClassID].PUBLIC[pMemberName])
							{
								if(gClassMemberScopes[tClassID].PROTECTED[pMemberName])
									{tIsFunctionProtected = true;}

								if(gClassMemberTypes[tClassID].FUNCTIONS[pMemberName] === 2)
								{
									if((tClassID == vClassID) &&
											(tObject === tClassInfoObject.CRX_OBJECT_SEGMENTS[tClassID]))
									{
										if(!tIsFunctionProtected || (tIsCallerAllowedProtectedAccess))
										{
											var tFunction = ftable_this_call__virtualPublic(vClassID, "puv", pMemberName);
											return tFunction.apply(tClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[vClassID],
													Array.prototype.slice.call(arguments, 2));
										}
										else
											{break;}
									}
								}
							}
							else
								{break;}
						}
						tObject = tObject.PARENT;
					}
				}
			}
		}

		halt('ILLEGAL ACCESS TO, OR UNKNOWN, MEMBER "' + pMemberName + '" IN CLASS "' + getClassNameOrID(gClassDefinitions[vClassID]) + '"');
	}
	function _this(pPrivateThis)
	{
		return function(pObject)
		{
			if(gIsHalted){return;}

			if(this === pPrivateThis)
			{
				var vClassID = getObjectClassID(this.THIS);

				if(vClassID !== null)
					{return (getClassInfoObject(this).CRX_PRIVATE_OBJECT_SEGMENTS[vClassID] || null);}
			}
			halt("SECURITY ERROR WHILE USING 'O'");
		}
	}
	/*START: SUPPORT STATIC FUNCTIONS (NON STRICT JS MODE ONLY)*/
	function _static__withStaticFunctionsSupport(pClass)
	{
		if(gIsHalted){return;}

		var vClass = getClassDefinition(pClass);

		if(vClass === null)
			{return null;}
		prepareClass(vClass);

		if(gClassPublicStatics[vClass.CRX_CLASS_ID])
		{
			if((gStaticContext[0] === vClass.CRX_CLASS_ID) &&
					(_static__withStaticFunctionsSupport.caller === gStaticContext[1]))
				{return (gClassPrivateStatics[vClass.CRX_CLASS_ID] || gClassPublicStatics[vClass.CRX_CLASS_ID] || null);}
			else
				{return (gClassPublicStatics[vClass.CRX_CLASS_ID] || null);}
		}
		else
			{return null;}
	}
	/*END: SUPPORT STATIC FUNCTIONS (NON STRICT JS MODE ONLY)*/
	function _instanceof(pObject, pClassOrInterface)
	{
		if(typeof(pObject) === 'string')
			{return false;}

		var vTypeOfObject = _typeOf(pObject);
		var vClassOrInterface = null;
		var vTypeOfClassOrInterface = null;//

		if(typeof(pClassOrInterface) === 'string')
		{
			vClassOrInterface = getClassDefinition(pClassOrInterface);
			if(vClassOrInterface === null)
				{vClassOrInterface = getInterface(pClassOrInterface);}
			if(vClassOrInterface === null)
				{return false;}
		}
		else
			{vClassOrInterface = pClassOrInterface}
		vTypeOfClassOrInterface = _typeOf(vClassOrInterface);

		if(vTypeOfObject === "$CRX__native")
		{
			if(vTypeOfClassOrInterface === "$CRX__native")
				{return (pObject instanceof pClassOrInterface);}
			return false;
		}
		else if((vTypeOfObject === "$CRX_DEFINITION__INTERFACE") ||
				(vTypeOfObject === "$CRX_DEFINITION__CLASS"))
			{return false;}
		else if(vTypeOfObject === "$CRX_OBJECT")
		{
			if(vTypeOfClassOrInterface === "$CRX_DEFINITION__CLASS")
			{
				var tClass = gClassDefinitions[getObjectClassID(pObject.THIS)];

				while(tClass)
				{
					if(vClassOrInterface.CRX_CLASS_ID === tClass.CRX_CLASS_ID)
						{return true;}

					if(tClass.hasOwnProperty("EXTENDS"))
						{tClass = getClassDefinition(tClass["EXTENDS"]);}
					else
						{tClass = null;}
				}
				return false;
			}
			else if(vTypeOfClassOrInterface === "$CRX_DEFINITION__INTERFACE")
			{
				var tClass = gClassDefinitions[getObjectClassID(pObject.THIS)];

				while(tClass)
				{
					if(gClassInterfaceFullTraces[tClass.CRX_CLASS_ID] &&
							gClassInterfaceFullTraces[tClass.CRX_CLASS_ID].hasOwnProperty(vClassOrInterface.CRX_INTERFACE_ID))
						{return true;}

					if(tClass.hasOwnProperty("EXTENDS"))
						{tClass = getClassDefinition(tClass["EXTENDS"]);}
					else
						{tClass = null;}
				}
				return false;
			}
		}
		return false;
	}
	function _typeOf(pObject)
	{
		if(pObject.CRX_DEFINITION)
		{
			if(pObject.CRX_INTERFACE_ID && (gInterfaceDefinitions[pObject.CRX_INTERFACE_ID] === pObject))
				{return "$CRX_DEFINITION__INTERFACE";}
			if(pObject.CRX_CLASS_ID && ((gClassDefinitions[pObject.CRX_CLASS_ID] === pObject) ||
					(gClassesWithVerboseDefinitions[pObject.CRX_CLASS_ID] === pObject)))
				{return "$CRX_DEFINITION__CLASS";}
		}
		if(pObject.CRX_CLASS_INFO && (getClassInfoObject(pObject) !== null))
			{return "$CRX_OBJECT";}

		return "$CRX__native";
	}

	function isClassExtending(pClassDefinitionOrClassName1, pClassDefinitionOrClassName2, pIsInclusiveCheck)
	{
		if(gIsHalted){return;}

		var vClass1 = getClassDefinition(pClassDefinitionOrClassName1);
		var vClass2 = getClassDefinition(pClassDefinitionOrClassName2);
		var vCompiledClass = null;

		if(vClass1 === null)
			{halt('UNDECLARED CLASS "??' + pClassDefinitionOrClassName1 + '??"');}
		else if(vClass2 === null)
			{halt('UNDECLARED CLASS "??' + pClassDefinitionOrClassName2 + '??"');}
		prepareClass(vClass1);
		prepareClass(vClass2);
		
		vCompiledClass = gCompiledClasses[vClass1.CRX_CLASS_ID];

		if(!pIsInclusiveCheck && (vCompiledClass === gCompiledClasses[vClass2.CRX_CLASS_ID]))
			{return false;}
		else
		{
			while(vCompiledClass)
			{
				if(vCompiledClass === gCompiledClasses[vClass2.CRX_CLASS_ID])
					{return true;}

				vCompiledClass = vCompiledClass.EXTENDS;
			}
		}
		return false;
	}
	function isClassImplementing(pClassDefinitionOrClassName, pInterfaceOrInterfaceName)
	{
		if(gIsHalted){return;}

		var vClass = getClassDefinition(pClassDefinitionOrClassName);
		var vInterface = getInterface(pInterfaceOrInterfaceName);
		
		if(vInterface === null)
			{halt('UNDECLARED INTERFACE "??' + pInterfaceOrInterfaceName + '??"');}
		
		prepareClass(vClass);

		while(vClass)
		{
			if(gClassInterfaceFullTraces[vClass.CRX_CLASS_ID] &&
					gClassInterfaceFullTraces[vClass.CRX_CLASS_ID].hasOwnProperty(vInterface.CRX_INTERFACE_ID))
				{return true;}

			if(vClass.hasOwnProperty("EXTENDS"))
				{vClass = getClassDefinition(vClass["EXTENDS"]);}
			else
				{vClass = null;}
		}
		return false;
	}
	
	function secureClassData(pData)
	{
		return function(/*pKey*/){
			/*if(pKey === gCODE_KEY);
			{
				gCODE_KEY = function(){};
				return pData;
			}*/
			gSecureClassData_return = pData;
		};
	}
	function assertIdentity(pServerInboundKey)
	{
		var vMessage = "Security Error, exposed method overriden";

		if(window.crx_new !== _new){halt(vMessage);return false;}
		else if(window.crx_registerClass !== registerClass){halt(vMessage);return false;}
		else if(window.crx_registerInterface !== registerInterface){halt(vMessage);return false;}
		else if(window.crx_static !== _static){halt(vMessage);return false;}
		else if(window.crxOop_setLogger !== setLogger){halt(vMessage);return false;}
		else if(window.crxOop_assertFunctionIdentity !== assertFunctionIdentity){halt(vMessage);return false;}
		else if(window.crxOop_assertIdentity !== assertIdentity){halt(vMessage);return false;}
		else if(window.crxOop_instanceof !== _instanceof){halt(vMessage);return false;}
		else if(window.crxOop_typeof !== _typeOf){halt(vMessage);return false;}
		else {return true;}
	}
	function assertFunctionIdentity(pObject, pFTableIndex, pFunctionName)
	{
		if(gClassFTables[getObjectClassID(pObject.THIS)][pFTableIndex][pFunctionName] !==
				pObject[pFunctionName])
			{halt("Security Error, object's public method was overriden");return false;}
	}
	function halt(pErrorMessage)
	{
		if(!gIsHalted)
		{
			if(!gIsRunningTestCasesMode)
			{
				emptyObject(gClassSignatures);
				emptyObject(gClassFTables);
				emptyObject(gClassVTables);
				emptyObject(gClassVTables_firstOccurances);
				emptyObject(gClassVTables_lastOccurances);
				emptyObject(gClassPublicStatics);
				emptyObject(gClassPrivateStatics);

				for(var tKey in gClassDefinitions)
				{
					if(gClassDefinitions.hasOwnProperty(tKey))
						{gClassDefinitions[tKey] = null;}
				}
				emptyObject(gClassDefinitions);
			}

			gIsHalted = true;
			gHaltMessage = pErrorMessage;
		}

		if(!gIsRunningTestCasesMode)
			{gFunc_log("CrxOop FATAL ERROR:: " + gHaltMessage, 0);}

		throw "CrxOop FATAL ERROR:: " + gHaltMessage;
	}
	function emptyObject(pObject)
	{
		var tKey = null;

		for(tKey in pObject)
		{
			if(pObject.hasOwnProperty(tKey))
				{delete pObject[tKey];}
		}
	}
	function mergeToObject(pObject1, pObject2)
	{
		for(var tKey in pObject2)
		{
			if(!pObject2.hasOwnProperty(tKey) || pObject1.hasOwnProperty(tKey))
				{continue;}
			
			pObject1[tKey] = pObject2[tKey];
		}
	}
	function setObjectReadOnlyMember(pObject, pKey, pValue)
	{
		if(gIS_STRICT_MODE && gIsReadOnlyWriteSupported)
		{
			setObjectReadOnlyMember.o.value = pValue;
			Object.defineProperty(pObject, pKey, setObjectReadOnlyMember.o);
		}
		else
			{pObject[pKey] = pValue;}
	}
	setObjectReadOnlyMember.o = {value: null, writable: false}
	function setObjectsReadOnlyMember(pObjects, pKey, pValue)
	{
		if(gIS_STRICT_MODE && gIsReadOnlyWriteSupported)
		{
			setObjectReadOnlyMember.o.value = pValue;
			for(var tI = pObjects.length - 1; tI > -1; tI--)
				{Object.defineProperty(pObjects[tI], pKey, setObjectReadOnlyMember.o);}
		}
		else
		{
			for(var tI = pObjects.length - 1; tI > -1; tI--)
				{pObjects[tI][pKey] = pValue;}
		}
	}
	

	function setLogger(pFunction)
	{
		if(gIsHalted || gIsStarted){return false;}

		g_Func_log = pFunction;

		return true;
	}

	function crxOop_var(pVariable, pIsToBeLenient)
	{
		if(typeof(pVariable) === "function")
			{return function(){if(gIsHalted){return;} return pVariable.apply(null, arguments);}}
		else
			{return pVariable;}
	}

	setObjectReadOnlyMember(window, "crx_new", _new);
	setObjectReadOnlyMember(window, "crx_registerClass", registerClass);
	setObjectReadOnlyMember(window, "crx_registerInterface", registerInterface);
	setObjectReadOnlyMember(window, "crx_static", (gIS_STRICT_JS ? _static : _static__withStaticFunctionsSupport));
	setObjectReadOnlyMember(window, "crxOop_setLogger", setLogger);	
	//setObjectReadOnlyMember(window, "crxOop_assertFunctionIdentity", assertFunctionIdentity);
	//setObjectReadOnlyMember(window, "crxOop_assertIdentity", assertIdentity);
	setObjectReadOnlyMember(window, "crxOop_instanceof", _instanceof);
	setObjectReadOnlyMember(window, "crxOop_typeof", _typeOf);
	setObjectReadOnlyMember(window, "crxOop_isClassExtending", 
			function(pClassDefinitionOrClassName1, pClassDefinitionOrClassName2)
			{return isClassExtending(pClassDefinitionOrClassName1, pClassDefinitionOrClassName2, false);});
	setObjectReadOnlyMember(window, "crxOop_isClassChaining", 
			function(pClassDefinitionOrClassName1, pClassDefinitionOrClassName2)
			{return isClassExtending(pClassDefinitionOrClassName1, pClassDefinitionOrClassName2, true);});
	setObjectReadOnlyMember(window, "crxOop_isClassImplementing", isClassImplementing);
	setObjectReadOnlyMember(window, "crxOop_areStaticFunctionsSupported", function(){return !gIS_STRICT_JS;});
	setObjectReadOnlyMember(window, "crxOop_createObject", gFunc_createObject);
	setObjectReadOnlyMember(window, "crxOop_setStrictMode", function(pIsStrictMode){if(gIsStarted){return;} gIS_STRICT_MODE = pIsStrictMode;});
	setObjectReadOnlyMember(window, "crxOop_areStructuresLocked", function(){return gIsReadOnlyWriteSupported && Object.seal && gFunc_freezeObject && gIS_STRICT_MODE;});
	setObjectReadOnlyMember(window, "crxOop_var", crxOop_var);
	setObjectReadOnlyMember(window, "crxOop_setRunningTestCasesMode", function(pIsRunningTestCases){if(gIsStarted){return;}if(pIsRunningTestCases){gIsRunningTestCasesMode = true;}});
	setObjectReadOnlyMember(window, "crxOop_unHalt", function(pMessage){if(gIsRunningTestCasesMode){if(!gIsHalted){halt("UNHALTING WHEN NOT HALTED: " + pMessage);} gIsHalted = false;}});
	
	/*window.crxOop_halt = halt;*/
})();
