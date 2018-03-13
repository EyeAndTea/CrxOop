//version: 2.6.2
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
	"use strict";

	var gIS_BROWSER = ((typeof(window) !== 'undefined') && (typeof(window.document) !== 'undefined'));
	var gCrxOop = null;
	var gWindow = null;

	if(resolveCrxOopInclusionAndReturnIsAlreadyIncluded())
		{return;}

	var gIS_STRICT_MODE = true;
	var gIS_STRICT_JS_SUPPORTED = (function(){"use strict"; return !this;})();
	var gIS_STRICT_JS = (gIS_STRICT_JS_SUPPORTED ? (function(){return !this;})() :
			((gWindow && gWindow.CRXNS_NON_STRICT_MODE) ? false : true));
	var gCODE_KEY = function(){};
	var SCOPE_PRIVATE = 1;
	var SCOPE_SHARED_PRIVATE = 2;
	var SCOPE_PUBLIC = 3;
	var SCOPE_SHARED_PUBLIC = 4;
	var SCOPE_PROTECTED = 5;
	var MEMBER_TYPE_VAR = 1;
	var MEMBER_TYPE_FUNCTION = 2;
	var HASOWN_TYPE_VAR = 1;
	var HASOWN_TYPE_FUNCTION = 2;
	var HASOWN_TYPE_FOREIGN = 4;
	var HASOWN_SCOPE_SHARED_PUBLIC = 8;
	var HASOWN_SCOPE_SHARED_PRIVATE = 16;
	var HASOWN_SCOPE_PRIVATE = 32;
	var DIRECTIVE_NO_PUBLIC_VARS_WRITE_DELEGATION = 1;
	var gIS_USING_NEW_STATIC_SYNTAX = true;
	//var MEMBER_TYPE_VIRTUAL_FUNCTION = 3;
	//var MEMBER_TYPE_PURE_VIRTUAL_FUNCTION = 4;
	var gSecureClassData_return = null;
	var gFunc_createObject = null;
	var gFunc_sealObject = (Object.seal && gIS_STRICT_MODE ? Object.seal : function(){});
	var gFunc_freezeObject = (Object.freeze ? Object.freeze : function(){});
	var gIsReadOnlyWriteSupported = false;
	var gIsDefinePropertySufficientlySupported = false;
	var gAreSettersAndGettersSupported = false;
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
	var gClassFriends = {}; //Class ID => Class IDs
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
	var gClassStaticThis = {};
	var gAreConstantsToBeCopiedToObjects = false;
	var gCheckedClassDefinitions = {};
	var gCheckedClassAdherenceToInterfaces = {};
	var gClassInterfaceFullTraces = {};
	var gClassInterfaceTraces = {};
	var gInterfaceSignatures = {};
	var gInterfaceIDCounter = 1;
	var gInterfaceDefinitions = {}; //Interface ID => Interface Definition
	var gInterfaceBuilds = {};
	var gParsingData = {};
//STRUCTURES: START
	var gStructureSignatures = {};
	var gStructureDefinitions = {};
	var gStructuresWithVerboseDefinitions = {};
	var gCompiledStructures = {};
	var gStructureIDCounter = 1;
	var gStructureFTables = {};
	var gStructureMemberScopes = {};
	var gStructureMemberTypes = {};
	var gStructureHasOwnIndex = {};
	var gCheckedStructureDefinitions = {};
	var gStructureParsingData = {};
	var gStructurePrototypes = {};
//STRUCTURES: END
	var gFunc_log = function(pMessage, pLevel){g_Func_log("CrxOop ==> " + pMessage, pLevel);};
	var g_Func_log = function(pMessage, pLevel)
	{
		var vWindow = (gWindow || global);

		if(vWindow && vWindow.console && vWindow.console.log)
			{vWindow.console.log(pMessage);}
	};
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
	var gStackOfIsConstructorCalled_structures = [];
	var gIsConstructorCalled_structures = {};
	var gTestObject = {};
	var gTraceKitReport = null;
	var gStackKitHandler = null;
	var gTraceKitError = "";
	var gError_start = null;
	var gError_end = null;
	var gWereCodeBoundriesEvaluated = false;


	function resolveCrxOopInclusionAndReturnIsAlreadyIncluded()
	{
		var vReturn = false;

		if(gIS_BROWSER)
		{
			if(window.crx_registerClass)
				{vReturn = true;}
			else
			{
				gCrxOop = {};
				gWindow = window;
			}
		}
		else
		{
			var tSymbol = Symbol['for']("225e78bc-206d-4319-aff0-68bb2796b931");
			var tGlobalSymbols = Object.getOwnPropertySymbols(global);

			if(tGlobalSymbols.indexOf(tSymbol) > -1)
			{
				vReturn = true;
				module.exports = global[tSymbol];
			}
			else
			{
				gCrxOop = {};
				global[tSymbol] = gCrxOop;
				module.exports = gCrxOop;

				if(typeof(global['window']) !== 'undefined')
					{gWindow = global.window;}
			}
		}

		return vReturn;
	}
	
	
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
			gIsDefinePropertySufficientlySupported = true;
			gAreSettersAndGettersSupported = true;
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
	
	if(!gIsReadOnlyWriteSupported && !gIS_STRICT_JS && !gIS_USING_NEW_STATIC_SYNTAX)
		{halt('CURRENT BROWSER IS NOT SUPPORTED IN NON STRICT MODE');}

	if(gIS_STRICT_MODE && !gIsReadOnlyWriteSupported)
		{gAreConstantsToBeCopiedToObjects = true;}

	function getType(pObject)
	{
		if(pObject == null)
			{return (pObject + "");}
		return (((typeof(pObject) === "object") || (typeof(pObject) === "function")) ?
				(gNamesOfTypes[Object.prototype.toString.call(pObject)] || "object") : (typeof(pObject)));
	}
	
	if(gIS_BROWSER && window.TraceKit && window.TraceKit.report && window.TraceKit.report.subscribe)
	{		
		gStackKitHandler = function(pError)
		{
			if((pError.message === 'CrxOop::start') || (pError.message === 'CrxOop::end'))
			{
				var tObject = null;

				if(pError.stack && (getType(pError.stack) === 'array') && pError.stack.length > 0)
				{
					tObject = {"fileName": (pError.stack[0].url ? pError.stack[0].url.toLowerCase() : null), 
							"line": (pError.stack[0].line ? pError.stack[0].line : -1), 
							"column": (pError.stack[0].column ? pError.stack[0].column : -1)};
				}
				else
					{tObject = {};}

				if((pError.message === 'CrxOop::start') && (gError_start === null))
					{gError_start = tObject ;}
				else if((pError.message === 'CrxOop::end') && (gError_end === null))
				{
					gError_end = tObject;
					gWereCodeBoundriesEvaluated = true;
				}
			}
			else
			{
				var vMessage = "";

				if(pError.message)
					{g_Func_log(pError.message, 0);}

				if(pError.stack && (getType(pError.stack) === 'array'))
				{
					vMessage = "CrxOop: Stack Trace \n";

					for(var tI = 0; tI < pError.stack.length; tI++)
					{
						if(!gTraceKitReport_isToSkipErrorOutPut((pError.stack[tI].url ? pError.stack[tI].url : null),
									(pError.stack[tI].line ? pError.stack[tI].line : null), 
									(pError.stack[tI].column ? pError.stack[tI].column : null)))
						{
							vMessage += pError.stack[tI].url + " :: ln<" + pError.stack[tI].line + 
									(pError.stack[tI].column ? ":" + pError.stack[tI].column : "") + ">";

							if(pError.stack[tI].func && (pError.stack[tI].func !== '?'))
							{
								vMessage += " => " + pError.stack[tI].func;
							}
							vMessage += "\n";
						}
					}
				}
				window.TraceKit.report.unsubscribe(gStackKitHandler);
				
				g_Func_log(vMessage, 0);
			}
		};

		gTraceKitReport = function(pString)
		{
			var vReturn = null;
			
			window.TraceKit.report.subscribe(gStackKitHandler);
			
			try
				{window.TraceKit.report(pString);}
			catch(tE)
				{vReturn = tE;}
				
			/*window.TraceKit.report(pString);
	
			//vReturn = gTraceKitError;	
			//gTraceKitError = "";
			
			//if(vReturn)
				//{return pString;}*/
		};
	}
	else if(gIS_BROWSER && window.StackTrace && window.StackTrace.get && window.StackTrace.fromError)
	{
		gTraceKitReport = function(pError, pMessage)
		{
			if((pError.message === 'CrxOop::start') || (pError.message === 'CrxOop::end'))
			{
				window.StackTrace.fromError(pError).then(function(pError)
				{
					var tObject = null;

					if(pError.length > 0)
					{
						tObject = {"fileName": (pError[0].fileName ? pError[0].fileName.toLowerCase() : null), 
								"line": (pError[0].lineNumber ? pError[0].lineNumber : -1), 
								"column": (pError[0].columnNumber ? pError[0].columnNumber : -1)};
					}

					if((pError.message === 'CrxOop::start') && (gError_start === null))
						{gError_start = tObject;}
					else if((pError.message === 'CrxOop::end') && (gError_end === null))
					{
						gError_end = tObject;
						gWereCodeBoundriesEvaluated = true;
					}
					//g_Func_log(vMessage, 0);
				})['catch'](function(pError)
				{
				});
			}
			else
			{
				window.StackTrace.fromError(pError).then(function(pError)
				{
					var vMessage = pMessage + '\n' + "CrxOop: Stack Trace \n";

					for(var tI = 0; tI < pError.length; tI++)
					{
						if(!gTraceKitReport_isToSkipErrorOutPut((pError[tI].fileName ? pError[tI].fileName : null),
									(pError[tI].lineNumber ? pError[tI].lineNumber : null), 
									(pError[tI].columnNumber ? pError[tI].columnNumber : null)))
						{
							vMessage += pError[tI].fileName + " :: ln<" + pError[tI].lineNumber + 
									(pError[tI].columnNumber ? ":" + pError[tI].columnNumber : "") + ">\t";

							if(pError[tI].functionName)
							{
								vMessage += " => " + pError[tI].functionName;
							}
							vMessage += "\n";
						}
					}

					g_Func_log(vMessage, 0);
				})['catch'](function(pError)
				{
					//g_Func_log(pError, 0);
				});
			}
		};
	}
	else
	{
		gTraceKitReport = function(pError, pMessage)
		{
			var tRegExp = new RegExp(".*?[\\(\\[\\s\\:](\\d+)([:]+(\\d*))?.*");
			var tRegExp2 = new RegExp(".+\\/([^\\/]+\\.js)[^a-zA-Z\\\"\\']*");

			if((pError.message === 'CrxOop::start') || (pError.message === 'CrxOop::end'))
			{
				var tObject = null;
				var vMessage = "" + pError.stack || pError.stacktrace;
				var tTrace = [];

				if(vMessage.length > 0)
					{tTrace = vMessage.split('\n');}

				if(tTrace.length > 0)
				{
					var tMatches = tRegExp.exec(tTrace[0]);
					var tMatches2 = tRegExp2.exec(tTrace[0]);
					
					if(!tMatches && !tMatches2 && (tTrace.length > 1) && ((tTrace[0].indexOf('CrxOop::start') >= 0) || 
							(tTrace[0].indexOf('CrxOop::end') >= 0)))
					{
						tMatches = tRegExp.exec(tTrace[1]);
						tMatches2 = tRegExp2.exec(tTrace[1]);
					}

					tObject = {"fileName": ((tMatches2 && tMatches2[1]) ? tMatches2[1].toLowerCase() : null),
							"line": ((tMatches && tMatches[1]) ? tMatches[1] : -1), 
							"column": ((tMatches && tMatches[3]) ? tMatches[3] : -1)};
				}

				if((pError.message === 'CrxOop::start') && (gError_start === null))
					{gError_start = tObject;}
				else if((pError.message === 'CrxOop::end') && (gError_end === null))
				{
					gError_end = tObject;
					gWereCodeBoundriesEvaluated = true;
				}
			}
			else
			{
				if(gIS_BROWSER)
				{
					setTimeout(function()
					{
						gTraceKitReport_produceMessage(pError, pMessage, tRegExp, tRegExp2);
					}, 1);
				}
				else
					{return gTraceKitReport_produceMessage(pError, pMessage, tRegExp, tRegExp2);}
			}
		}
	}
	
	try{throw new Error('CrxOop::start');}catch(tE){gTraceKitReport(tE);}

	function gTraceKitReport_produceMessage(pError, pMessage, pRegExp, pRegExp2)
	{
		var vMessage = "" + (pError.stack || pError.stacktrace || "");

		if(vMessage.length > 0)
		{
			var tTrace = vMessage.split('\n');
			
			vMessage = "";

			for(var tI = 0; tI < tTrace.length; tI++)
			{
				if(tTrace[tI] && (tTrace[tI].toLowerCase().indexOf("crxoop.") >= 0))
					{continue;}
				
				var vIsToSkip = false;
				var tMatches = pRegExp.exec(tTrace[tI]);
				var tMatches2 = pRegExp2.exec(tTrace[tI]);

				if(!gTraceKitReport_isToSkipErrorOutPut(((tMatches2 && tMatches2[1]) ? tMatches2[1] : null), 
						((tMatches && tMatches[1]) ? tMatches[1] : null), 
						((tMatches && tMatches[3]) ? tMatches[3] : null)))
					{vMessage += tTrace[tI] + '\n';}
			}

			g_Func_log("\n" + pMessage + "\n" + "CrxOop: Stack Trace \n" + vMessage, 0);

			return "\n" + pMessage + "\n" + "CrxOop: Stack Trace \n" + vMessage;
		}
		else
			{return "\n" + pMessage + "\n";}
	}
	function gTraceKitReport_isToSkipErrorOutPut(pFileName, pLine, pColumn)
	{
		var vReturn = false;

		if(gError_start && gError_end)
		{
			if(pFileName)
			{
				if(gError_start.fileName === pFileName.toLowerCase())
				{
					if((gError_start.line !== -1) && (gError_end.line !== -1) && pLine)
					{
						if((pLine >= gError_start.line) && (pLine <= gError_end.line))
						{
							if((gError_start.line === gError_end.line) && (gError_start.column !== -1) && 
									(gError_end.column !== -1) && pColumn)
							{
								if((pColumn >= gError_start.column) &&
										(pColumn <= gError_end.column))
									{vReturn = true;}
							}
							else
								{vReturn = true;}
						}
					}
					else
						{vReturn = true;}
				}
			}
		}
		else if(pFileName)
		{
			if(pFileName.toLowerCase().indexOf("crxoop.") >= 0)
				{vReturn = true;}
		}

		return vReturn;
	}
	
	function registerClass(pClassName, pClassDefinition)
	{
		if(gIsHalted){return;}

		gIsStarted = true;

		if(gClassSignatures.hasOwnProperty(pClassName) ||
				gInterfaceSignatures.hasOwnProperty(pClassName) ||
				gStructureSignatures.hasOwnProperty(pClassName))
			{halt("Interface or Class or Structure with name '" + pClassName + "' already declared", -1);}

		if(!pClassDefinition.CRX_CLASS_ID)
		{
			pClassDefinition.CRX_DEFINITION = true;
			pClassDefinition.CRX_CLASS_ID = gClassIDCounter;
			pClassDefinition.CRX_CLASS_NAME = pClassName;

			if((pClassDefinition.CRX_DEFINITION !== true) || (pClassDefinition.CRX_CLASS_ID !== pClassDefinition.CRX_CLASS_ID) ||
					(pClassDefinition.CRX_CLASS_NAME !== pClassName) || (pClassDefinition.CRX_INTERFACE_ID !== undefined))
				{halt("UNKNOWN ERROR IN DEFINITION OF CLASS '" + pClassName + "'", -1);}
			gFunc_freezeObject(pClassDefinition);

			inspectClassDefinition_processVerboseDefinition(pClassDefinition);
			gClassIDCounter = gClassIDCounter + 1;
		}
		gClassSignatures[pClassName] = pClassDefinition.CRX_CLASS_ID;
	}
	function getClassDefinition(pClassDefinitionOrClassName, pIsToNotRegister)
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
		else if((pClassDefinitionOrClassName === null) || (typeof(pClassDefinitionOrClassName) !== "object") || 
				(pClassDefinitionOrClassName.CRX_INTERFACE_ID !== undefined) ||
				(pClassDefinitionOrClassName.CRX_STRUCTURE_ID !== undefined))
			{return null;}
		else
		{
			if(!pClassDefinitionOrClassName.CRX_CLASS_ID && !pIsToNotRegister)
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
				gInterfaceSignatures.hasOwnProperty(pInterfaceName) ||
				gStructureSignatures.hasOwnProperty(pInterfaceName))
			{halt("Interface or Class or Structure with name '" + pInterfaceName + "' already declared", -1);}

		if(!pInterface.CRX_INTERFACE_ID)
		{
			pInterface.CRX_DEFINITION = true;
			pInterface.CRX_INTERFACE_ID = gInterfaceIDCounter;
			pInterface.CRX_INTERFACE_NAME = pInterfaceName;

			if((pInterface.CRX_DEFINITION !== true) || (pInterface.CRX_INTERFACE_ID !== gInterfaceIDCounter) ||
					(pInterface.CRX_INTERFACE_NAME !== pInterfaceName) ||
					(pInterface.CRX_CLASS_ID !== undefined))
				{halt("UNKNOWN ERROR IN DEFINITION OF INTERFACE '" + pInterfaceName + "'", -1);}
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
		else if((pInterfaceOrInterfaceName === null) || (typeof(pInterfaceOrInterfaceName) !== "object") || 
				(pInterfaceOrInterfaceName.CRX_CLASS_ID !== undefined) ||
				(pInterfaceOrInterfaceName.CRX_STRUCTURE_ID !== undefined))
			{return null;}
		else
		{
			if(!pInterfaceOrInterfaceName.CRX_INTERFACE_ID)
			{
				pInterfaceOrInterfaceName.CRX_DEFINITION = true;
				pInterfaceOrInterfaceName.CRX_INTERFACE_ID = gInterfaceIDCounter;

				if((pInterfaceOrInterfaceName.CRX_DEFINITION !== true) ||
						(pInterfaceOrInterfaceName.CRX_INTERFACE_ID !== gInterfaceIDCounter))
					{halt("UNKNOWN ERROR IN DEFINITION OF INTERFACE '$I" + gInterfaceIDCounter + "'", -1);}
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

	function registerStructure(pStructureName, pStructure)
	{
		if(gIsHalted){return;}

		gIsStarted = true;

		if(gClassSignatures.hasOwnProperty(pStructureName) ||
				gInterfaceSignatures.hasOwnProperty(pStructureName) ||
				gStructureSignatures.hasOwnProperty(pStructureName))
			{halt("Interface or Class or Structure with name '" + pStructureName + "' already declared", -1);}

		if(!pStructure.CRX_STRUCTURE_ID)
		{
			pStructure.CRX_DEFINITION = true;
			pStructure.CRX_STRUCTURE_ID = gStructureIDCounter;
			pStructure.CRX_STRUCTURE_NAME = pStructureName;

			if((pStructure.CRX_DEFINITION !== true) || (pStructure.CRX_STRUCTURE_ID !== gStructureIDCounter) ||
					(pStructure.CRX_STRUCTURE_NAME !== pStructureName) ||
					(pStructure.CRX_CLASS_ID !== undefined) ||
					(pStructure.CRX_INTERFACE_ID !== undefined))
				{halt("UNKNOWN ERROR IN DEFINITION OF STRUCTRE '" + pStructureName + "'", -1);}
			gFunc_freezeObject(pStructure);

			gStructureDefinitions[gStructureIDCounter] = pStructure;
			gStructureIDCounter = gStructureIDCounter + 1;
		}
		gStructureSignatures[pStructureName] = pStructure.CRX_STRUCTURE_ID;
	}
	function getStructureDefinition(pStructureOrStructureName, pIsToNotRegister)
	{
		if(gIsHalted){return;}

		if(typeof(pStructureOrStructureName) === "string")
		{
			if(!gStructureSignatures[pStructureOrStructureName])
				{return null;}
			else
				{return (gStructureDefinitions[gStructureSignatures[pStructureOrStructureName]] || null);}
		}
		else if((pStructureOrStructureName === null) || (typeof(pStructureOrStructureName) !== "object") || 
				(pStructureOrStructureName.CRX_CLASS_ID !== undefined) ||
				(pStructureOrStructureName.CRX_INTERFACE_ID !== undefined))
			{return null;}
		else
		{
			if(!pStructureOrStructureName.CRX_STRUCTURE_ID && !pIsToNotRegister)
			{
				pStructureOrStructureName.CRX_DEFINITION = true;
				pStructureOrStructureName.CRX_STRUCTURE_ID = gStructureIDCounter;

				if((pStructureOrStructureName.CRX_DEFINITION !== true) ||
						(pStructureOrStructureName.CRX_STRUCTURE_ID !== gStructureIDCounter))
					{halt("UNKNOWN ERROR IN DEFINITION OF INTERFACE '$I" + gStructureIDCounter + "'");}
				gFunc_freezeObject(pStructureOrStructureName);

				gStructureDefinitions[gStructureIDCounter] = pStructureOrStructureName;
				gStructureIDCounter = gStructureIDCounter + 1;
			}

			return gStructureDefinitions[pStructureOrStructureName.CRX_STRUCTURE_ID];
		}
	}
	function getStructureID(pStructureOrStructureName)
	{
		if(gIsHalted){return;}

		if(typeof(pStructureOrStructureName) === "string")
			{return (gStructureSignatures[pStructureOrStructureName] || null);}
		return (pStructureOrStructureName.CRX_STRUCTURE_ID || null);
	}
	function getStructureNameOrID(pStructure)
	{
		if(pStructure.CRX_STRUCTURE_NAME)
			{return pStructure.CRX_STRUCTURE_NAME;}
		if(pStructure.CRX_STRUCTURE_ID)
			{return "$S" + pStructure.CRX_STRUCTURE_ID;}
		return null;
	}


	/*function _new(pClassDefinitionOrClassName, pParameter01, pParameter02, ...)*/
	/*function _new(pStructureDefinitionOrStructureName, pParameter01, pParameter02, ...)*/
	/*function _new(pLength, pClassDefinitionOrClassName, pParameter01, pParameter02, ...)*/
	/*function _new(pLength, pStructureDefinitionOrStructureName, pParameter01, pParameter02, ...)*/
	/*function _new(pLength, pParametersArray, pClassDefinitionOrClassName)*/
	/*function _new(pLength, pParametersArray, pStructureDefinitionOrStructureName)*/
	/*function _new(pLength, pParametersFunction, pClassDefinitionOrClassName)*/
	/*function _new(pLength, pParametersFunction, pStructureDefinitionOrStructureName)*/
	function _new(pParameter1, pParameter2, pParameter3)
	{
		if(gIsHalted){return;}

		var vIS_ARRAY_MODE = false;
		var vClass = null;
		var vStructure = null;
		var vObjects = [];
		var vLength = -1;
		var vParameters = null;
		var vClassOrStructureDefinitionOrNameFromParameters = null;
		var vTypeOfParameter2 = getType(pParameter2);
		var tI = 0;

		gIsStarted = true;

		if(typeof(pParameter1) === "number")
		{
			vIS_ARRAY_MODE = true;
			vLength = Math.abs(pParameter1);
			if((vTypeOfParameter2 !== 'array') && (vTypeOfParameter2 !== 'function'))
			{
				vClassOrStructureDefinitionOrNameFromParameters = pParameter2;
				vClass = getClassDefinition(pParameter2);

				if(vClass === null)
					{vStructure = getStructureDefinition(pParameter2);}

				vParameters = Array.prototype.slice.call(arguments, 2);
			}
			else
			{
				if((vTypeOfParameter2 === 'array') && (pParameter2.length < 1))
					{return null;}
				vClassOrStructureDefinitionOrNameFromParameters = pParameter3;
				vClass = getClassDefinition(pParameter3);

				if(vClass === null)
					{vStructure = getStructureDefinition(pParameter3);}

				vParameters = pParameter2;
			}
		}
		else
		{
			vClassOrStructureDefinitionOrNameFromParameters = pParameter1;
			vClass = getClassDefinition(pParameter1);

			if(vClass === null)
				{vStructure = getStructureDefinition(pParameter1);}

			vLength = 1;
			vParameters = Array.prototype.slice.call(arguments, 1);
		}

		if((vClass === null) && (vStructure === null))
			{halt("UNABLE TO RESOLVE CLASS/STRUCTURE \"" + vClassOrStructureDefinitionOrNameFromParameters + "\"DURING CALL TO crx_new", -1);}

		if(vStructure === null)
		{
			var tCRX_CLASS_INFOs = [];

			gStackOfIsConstructorCalled.push(gIsConstructorCalled);
			gIsConstructorCalled = {};

			for(tI = 0; tI < vLength; tI++)
				{tCRX_CLASS_INFOs[tI] = {};}

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
				halt("CAN NOT CREATE INSTANCE OF ABSTRACT CLASS \"" + getClassNameOrID(vClass) + "\". MISSING IMPLEMENTATIONS FOR FUNCTIONS " + tRestOfMessage, -1);
			}

			vObjects = _new_build(gCompiledClasses[vClass.CRX_CLASS_ID], tCRX_CLASS_INFOs, /*{p: false},*/ vLength);

			if(vObjects.length === 0)
				{halt("UNKNOWN ERROR DURING CALL TO crx_new", -1);}

			for(var tKey in gClassVTables[vClass.CRX_CLASS_ID])
			{
				if(!gClassVTables[vClass.CRX_CLASS_ID].hasOwnProperty(tKey))
					{continue;}

				for(tI = 0; tI < vLength; tI++)
				{
					setObjectReadOnlyMember(tCRX_CLASS_INFOs[tI].
							CRX_OBJECT_SEGMENTS[gClassVTables_firstOccurances[
							vClass.CRX_CLASS_ID][tKey]], tKey, ftable_this_call__virtual(vClass.CRX_CLASS_ID, "puv", tKey));
				}
			}

			if(vObjects[0].CONSTRUCT)
			{
				try
				{
					if(!vIS_ARRAY_MODE)
					{
						vObjects[0].CONSTRUCT.apply(vObjects[0], vParameters);
						gIsConstructorCalled[vObjects[0].CRX_CLASS_ID] = false;
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
					{halt('CONSTRUCTION OF CLASS \"' + getClassNameOrID(vClass) + '\" THREW AN EXCEPTION: ' + tE, tE);}
			}

			for(tI = 0; tI < vLength; tI++)
				{tCRX_CLASS_INFOs[tI].CRX_CLASS_ID = vClass.CRX_CLASS_ID;}

			if(gIS_STRICT_MODE)
			{
				for(var tKey in tCRX_CLASS_INFOs[0].CRX_OBJECT_SEGMENTS)
				{
					if(!tCRX_CLASS_INFOs[0].CRX_OBJECT_SEGMENTS.hasOwnProperty(tKey))
						{continue;}


					for(tI = 0; tI < vLength; tI++)
						{gFunc_sealObject(tCRX_CLASS_INFOs[tI].CRX_OBJECT_SEGMENTS[tKey]);}
				}
			}
			gIsConstructorCalled = gStackOfIsConstructorCalled.pop();

			if(!vIS_ARRAY_MODE)
				{return vObjects[0];}
			else
				{return vObjects;}
		}
		else
		{
			var tCRX_STRUCTURE_INFOs = [];

			gStackOfIsConstructorCalled_structures.push(gIsConstructorCalled_structures);
			gIsConstructorCalled_structures = {};

			for(tI = 0; tI < vLength; tI++)
				{tCRX_STRUCTURE_INFOs[tI] = {};}

			prepareStructure(vStructure);
			if(gIsHalted){return null;}

			vObjects = _new_buildStructure(gCompiledStructures[vStructure.CRX_STRUCTURE_ID], tCRX_STRUCTURE_INFOs, vLength);

			if(vObjects.length === 0)
				{halt("UNKNOWN ERROR DURING CALL TO crx_new", -1);}

			if(gCompiledStructures[vStructure.CRX_STRUCTURE_ID].PUBLIC && gCompiledStructures[vStructure.CRX_STRUCTURE_ID].PUBLIC_CONSTRUCT)
			{
				try
				{
					if(!vIS_ARRAY_MODE)
					{
						gCompiledStructures[vStructure.CRX_STRUCTURE_ID].PUBLIC_CONSTRUCT.apply(vObjects[0], vParameters);
						gIsConstructorCalled_structures[vStructure.CRX_STRUCTURE_ID] = false;
						delete(tCRX_STRUCTURE_INFOs[0].CRX_SHARED_SEGMENT.CONSTRUCT);
					}
					else
					{
						if(vTypeOfParameter2 === "function")
						{
							for(tI = 0; tI < vLength; tI++)
							{
								gCompiledStructures[vStructure.CRX_STRUCTURE_ID].PUBLIC_CONSTRUCT.apply(vObjects[tI], vParameters(tI));
								gIsConstructorCalled_structures[vStructure.CRX_STRUCTURE_ID] = false;
							}
						}
						else if(vTypeOfParameter2 === "array")
						{
							var tLength = vParameters.length;

							for(tI = 0; tI < vLength; tI++)
							{
								if(tI < tLength)
									{gCompiledStructures[vStructure.CRX_STRUCTURE_ID].PUBLIC_CONSTRUCT.apply(vObjects[tI], vParameters[tI]);}
								else
									{gCompiledStructures[vStructure.CRX_STRUCTURE_ID].PUBLIC_CONSTRUCT.apply(vObjects[tI], vParameters[tLength - 1]);}
								gIsConstructorCalled_structures[vStructure.CRX_STRUCTURE_ID] = false;
							}
						}
						else
						{
							for(tI = 0; tI < vLength; tI++)
							{
								gCompiledStructures[vStructure.CRX_STRUCTURE_ID].PUBLIC_CONSTRUCT.apply(vObjects[tI], vParameters);
								gIsConstructorCalled_structures[vStructure.CRX_STRUCTURE_ID] = false;
							}
						}
						for(tI = 0; tI < vLength; tI++)
							{delete(tCRX_STRUCTURE_INFOs[tI].CRX_SHARED_SEGMENT.CONSTRUCT);}
						gIsConstructorCalled_structures[vStructure.CRX_STRUCTURE_ID] = false;
					}
				}
				catch(tE)
					{halt('CONSTRUCTION OF STRUCTURE \"' + getStructureNameOrID(vStructure) + '\" THREW AN EXCEPTION: ' + tE, tE);}
			}

			if(gIS_STRICT_MODE)
			{
				if(tCRX_STRUCTURE_INFOs[0].CRX_SHARED_SEGMENT === tCRX_STRUCTURE_INFOs[0].CRX_SHARED_PRIVATE_SEGMENT)
				{
					for(tI = 0; tI < vLength; tI++)
						{gFunc_sealObject(tCRX_STRUCTURE_INFOs[tI].CRX_SHARED_SEGMENT);}
				}
				else
				{
					for(tI = 0; tI < vLength; tI++)
					{
						gFunc_sealObject(tCRX_STRUCTURE_INFOs[tI].CRX_SHARED_SEGMENT);
						gFunc_sealObject(tCRX_STRUCTURE_INFOs[tI].CRX_SHARED_PRIVATE_SEGMENT);
					}
				}
			}
			gIsConstructorCalled_structures = gStackOfIsConstructorCalled_structures.pop();

			if(!vIS_ARRAY_MODE)
				{return vObjects[0];}
			else
				{return vObjects;}
		}
	}
	function _new_build(pCompiledClass, pCRX_CLASS_INFOs, /*pWereProtectedMembersEncountered,*/ pLength)
	{
		var vObjects = [];
		var vObjects_privates = [];
		var vIsConstructorFound = false;
		var tObject = null;
		var tI = 0;
		var tI2 = 0;

		if(pCompiledClass.EXTENDS !== null)
		{
			tObjects = _new_build(pCompiledClass.EXTENDS, pCRX_CLASS_INFOs, /*pWereProtectedMembersEncountered,*/ pLength);

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
				pCRX_CLASS_INFOs[tI].CRX_IS_ANNULED = false;

				setObjectReadOnlyMember(vObjects[tI], "CRX_CLASS_INFO", secureClassData(pCRX_CLASS_INFOs[tI]));
			}
			setObjectsReadOnlyMember(vObjects, "CAST", _cast);
			setObjectsReadOnlyMember(vObjects, "SR", _sr);
			//setObjectsReadOnlyMember(vObjects, "C", _class);
			
			for(tI = 0; tI < pLength; tI++)
				{vObjects[tI] = gFunc_createObject(vObjects[tI]);}
		}
		
		/* //PRE V1.51 OPTIMIZATION. HAD TO BE REMOVED DUE TO IMPLEMNTING FRIENDS. REFER ALSO TO TEST CASE fri003
		if(pCompiledClass.PROTECTED)
			{pWereProtectedMembersEncountered.p = true;}

		if(!pCompiledClass.PRIVATE && !gClassPrivateStatics[pCompiledClass.CRX_CLASS_ID] && !pWereProtectedMembersEncountered.p &&
				(!pCompiledClass.PUBLIC || (pCompiledClass.PUBLIC_VARS.length === 0)))
		{
			for(tI = 0; tI < pLength; tI++)
			{
				pCRX_CLASS_INFOs[tI].CRX_PRIVATE_OBJECT_SEGMENTS[pCompiledClass.CRX_CLASS_ID] = vObjects[tI];
				setObjectReadOnlyMember(vObjects[tI], "O", _this(vObjects[tI]));
			}
		}
		else
		{*/
			for(tI = 0; tI < pLength; tI++)
			{
				vObjects_privates[tI] = gFunc_createObject(vObjects[tI]);
				pCRX_CLASS_INFOs[tI].CRX_PRIVATE_OBJECT_SEGMENTS[pCompiledClass.CRX_CLASS_ID] =
						vObjects_privates[tI];
				setObjectReadOnlyMember(vObjects_privates[tI], "O", _this(vObjects_privates[tI]));
				setObjectReadOnlyMember(vObjects_privates[tI], "ANNUL", _annul);
			}

			if(pCompiledClass.PRIVATE)
			{
				for(tI = pCompiledClass.PRIVATE_VARS.length - 1; tI > -1; tI--)
				{
					/*for(tI2 = 0; tI2 < pLength; tI2++)
					{
						vObjects_privates[tI2][pCompiledClass.PRIVATE_VARS[tI][0]] = pCompiledClass.PRIVATE_VARS[tI][1];
						setMemberPrivateCapture(pCompiledClass.CRX_CLASS_ID, vObjects_privates[tI2],
								vObjects[tI2], pCompiledClass.PRIVATE_VARS[tI][0]);
					}*/

					setObjectsMember(vObjects_privates, pCompiledClass.PRIVATE_VARS[tI][0], pCompiledClass.PRIVATE_VARS[tI][1]);

					if(!gIS_STRICT_JS && !gIS_USING_NEW_STATIC_SYNTAX)
					{
						_new_build.o1.get = pCompiledClass.PRIVATE_VARS[tI][2];
						_new_build.o1.set = pCompiledClass.PRIVATE_VARS[tI][3];

						for(tI2 = 0; tI2 < pLength; tI2++)
							{Object.defineProperty(vObjects[tI2], pCompiledClass.PRIVATE_VARS[tI][0], _new_build.o1);}
					}
				}
				for(tI = pCompiledClass.PRIVATE_FUNCTIONS.length - 1; tI > -1; tI--)
				{
					setObjectsReadOnlyMember(vObjects_privates, pCompiledClass.PRIVATE_FUNCTIONS[tI][0],
							ftable_this_call(pCompiledClass.CRX_CLASS_ID, 'pr', pCompiledClass.PRIVATE_FUNCTIONS[tI][0],
							pCompiledClass.PRIVATE_FUNCTIONS[tI][1], false));

					if(!gIS_STRICT_JS && !gIS_USING_NEW_STATIC_SYNTAX)
					{
						_new_build.o3.get = pCompiledClass.PRIVATE_FUNCTIONS[tI][2];
						_new_build.o3.set = pCompiledClass.PRIVATE_FUNCTIONS[tI][3];

						for(tI2 = 0; tI2 < pLength; tI2++)
						{
							//setThisCallPrivateCapture(pCompiledClass.CRX_CLASS_ID, vObjects_privates[tI2],
									//vObjects[tI2], pCompiledClass.PRIVATE_FUNCTIONS[tI][0]);
							Object.defineProperty(vObjects[tI2], pCompiledClass.PRIVATE_FUNCTIONS[tI][0], _new_build.o3);
						}
					}
				}
			}

			if(gClassPrivateStatics[pCompiledClass.CRX_CLASS_ID])
			{
				if(gAreConstantsToBeCopiedToObjects && ((pCompiledClass.PRIVATE_CONSTS.length > 0) || 
						(pCompiledClass.PUBLIC && (pCompiledClass.PUBLIC_CONSTS.length > 0))))
				{
					for(tI = 0; tI < pLength; tI++)
					{
						tObject = gFunc_createObject(gClassPrivateStatics[pCompiledClass.CRX_CLASS_ID]);

						for(tI2 = pCompiledClass.PRIVATE_CONSTS.length - 1; tI2 > -1; tI2--)
						{
							//tObject[pCompiledClass.PRIVATE_CONSTS[tI2][0]] = pCompiledClass.PRIVATE_CONSTS[tI2][1];
							setObjectMember(tObject, pCompiledClass.PRIVATE_CONSTS[tI2][0], pCompiledClass.PRIVATE_CONSTS[tI2][1]);
						}

						if(pCompiledClass.PUBLIC)
						{
							for(tI2 = pCompiledClass.PUBLIC_CONSTS.length - 1; tI2 > -1; tI2--)
							{
								//tObject[pCompiledClass.PUBLIC_CONSTS[tI2][0]] = pCompiledClass.PUBLIC_CONSTS[tI2][1];
								setObjectMember(tObject, pCompiledClass.PUBLIC_CONSTS[tI2][0], pCompiledClass.PUBLIC_CONSTS[tI2][1]);
							}
						}

						setObjectReadOnlyMember(vObjects_privates[tI], "STATIC", tObject);
					}
				}
				else
				{
					setObjectsReadOnlyMember(vObjects_privates, "STATIC",
							gClassPrivateStatics[pCompiledClass.CRX_CLASS_ID]);
				}
			}
		/*}*/

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
					_new_build.o1.get = pCompiledClass.PUBLIC_VARS[tI][2];
					_new_build.o1.set = pCompiledClass.PUBLIC_VARS[tI][3];
					_new_build.o2.value = pCompiledClass.PUBLIC_VARS[tI][1];

					for(tI2 = 0; tI2 < pLength; tI2++)
					{
						//vObjects[tI2][pCompiledClass.PUBLIC_VARS[tI][0]] = pCompiledClass.PUBLIC_VARS[tI][1];
						Object.defineProperty(vObjects_privates[tI2], pCompiledClass.PUBLIC_VARS[tI][0], _new_build.o2);
						Object.defineProperty(vObjects[tI2], pCompiledClass.PUBLIC_VARS[tI][0], _new_build.o1);
					}
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
							vObjects[tI]['CONSTRUCT'] = this_call__constructor(pCompiledClass.CRX_CLASS_ID, tObjects[tI], vObjects[tI],
									pCompiledClass.PUBLIC_CONSTRUCT);
						}
					}
					else
					{
						for(tI = 0; tI < pLength; tI++)
						{
							vObjects[tI]['CONSTRUCT'] = this_call__constructor(pCompiledClass.CRX_CLASS_ID, tObjects[tI], vObjects[tI],
									pCompiledClass.PUBLIC_CONSTRUCT);
						}
					}
				}
				if(gClassPublicStatics[pCompiledClass.CRX_CLASS_ID])
				{
					if(gAreConstantsToBeCopiedToObjects && (pCompiledClass.PUBLIC_CONSTS.length > 0))
					{
						for(tI = 0; tI < pLength; tI++)
						{
							tObject = gFunc_createObject(gClassPublicStatics[pCompiledClass.CRX_CLASS_ID]);

							for(tI2 = pCompiledClass.PUBLIC_CONSTS.length - 1; tI2 > -1; tI2--)
							{
								tObject[pCompiledClass.PUBLIC_CONSTS[tI2][0]] = pCompiledClass.PUBLIC_CONSTS[tI2][1];
								//setObjectMember(tObject, pCompiledClass.PUBLIC_CONSTS[tI2][0], pCompiledClass.PUBLIC_CONSTS[tI2][1]);
							}

							setObjectReadOnlyMember(vObjects[tI], "STATIC", tObject);
						}
					}
					else
						{setObjectsReadOnlyMember(vObjects, "STATIC", gClassPublicStatics[pCompiledClass.CRX_CLASS_ID]);}
				}
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
						{vObjects[tI].CONSTRUCT = this_call__constructor(pCompiledClass.CRX_CLASS_ID, vObjects_privates[tI], vObjects[tI]);}
				}
				else
				{
					for(tI = 0; tI < pLength; tI++)
						{vObjects[tI].CONSTRUCT = this_call__constructor(pCompiledClass.CRX_CLASS_ID, vObjects[tI], vObjects[tI]);}
				}
			}
		}

		for(tI = 0; tI < pLength; tI++)
			{pCRX_CLASS_INFOs[tI].CRX_OBJECT_SEGMENTS[pCompiledClass.CRX_CLASS_ID] = vObjects[tI];}
		setObjectsReadOnlyMember(vObjects, "CRX_CLASS_ID", pCompiledClass.CRX_CLASS_ID);

		return vObjects;
	}
	_new_build.o1 = {"get": null, "set": null, "enumerable": true};
	_new_build.o2 = {"value": null, "writable": true, "enumerable": true};
	_new_build.o3 = {"get": null, "set": null, "enumerable": false};
	/*function this_call(pPrivateThis, pPublicThis, pFunction)
	{
		return function() {
			if(gIsHalted){return;}
			return pFunction.apply(pPrivateThis, arguments);
		};
	}*/
	function this_call__constructor(pClassID, pPrivateThis, pPublicThis, pFunction)
	{
		return this_call__constructor.usingFTables(pClassID, pPrivateThis, pPublicThis, pFunction);
		/*if(pFunction)
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
				if(gIsConstructorCalled[pPublicThis.CRX_CLASS_ID])
					{halt('SECOND CALL TO CONSTRUCTOR');}
				gIsConstructorCalled[pPublicThis.CRX_CLASS_ID] = true;
				if(gIsConstructorCalled[pPublicThis.PARENT.CRX_CLASS_ID])
					{halt('UNKNOWN CONSTRUCTION ERROR');}
				pPublicThis.PARENT.CONSTRUCT();
				if(!gIsConstructorCalled[pPublicThis.PARENT.CRX_CLASS_ID])
					{halt('UNKNOWN CONSTRUCTION ERROR');}
				gIsConstructorCalled[pPublicThis.PARENT.CRX_CLASS_ID] = false;
				delete(pPublicThis.PARENT.CONSTRUCT);
			};
		}*/
	}
	this_call__constructor.usingFTables = function(pClassID, pPrivateThis, pPublicThis, pFunction)
	{
		if(gClassFTables[pClassID] && gClassFTables[pClassID]["pub"] &&
				gClassFTables[pClassID]["pub"]["CONSTRUCT"])
			{return gClassFTables[pClassID]["pub"]["CONSTRUCT"];}
		else
		{
			if(!gClassFTables[pClassID])
				{gClassFTables[pClassID] = {};}
			if(!gClassFTables[pClassID]['pub'])
				{gClassFTables[pClassID]['pub'] = {};}
			
			if(pFunction)
			{
				gClassFTables[pClassID]['pub']['CONSTRUCT'] = (function(pClassID, pFunction)
				{
					return function(){
						if(gIsHalted){return;}

						var tClassInfoObject = getClassInfoObject(this);

						if(gIsConstructorCalled[pClassID])
							{halt('SECOND CALL TO CONSTRUCTOR');}
						gIsConstructorCalled[pClassID] = true;
						if(gCompiledClasses[pClassID].EXTENDS)
						{
							if(gIsConstructorCalled[gCompiledClasses[pClassID].EXTENDS.CRX_CLASS_ID])
								{halt('UNKNOWN CONSTRUCTION ERROR');}
							pFunction.apply(tClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[pClassID], arguments);
							if(!gIsConstructorCalled[gCompiledClasses[pClassID].EXTENDS.CRX_CLASS_ID])
								{tClassInfoObject.CRX_OBJECT_SEGMENTS[gCompiledClasses[pClassID].EXTENDS.CRX_CLASS_ID].CONSTRUCT();}
							if(!gIsConstructorCalled[gCompiledClasses[pClassID].EXTENDS.CRX_CLASS_ID])
								{halt('UNKNOWN CONSTRUCTION ERROR');}
							gIsConstructorCalled[gCompiledClasses[pClassID].EXTENDS.CRX_CLASS_ID] = false;
							delete(tClassInfoObject.CRX_OBJECT_SEGMENTS[gCompiledClasses[pClassID].EXTENDS.CRX_CLASS_ID].CONSTRUCT);
						}
						else
							{pFunction.apply(tClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[pClassID], arguments);}
					};
				})(pClassID, pFunction);

				signClassFunction(pFunction, pClassID);
			}
			else
			{
				gClassFTables[pClassID]['pub']['CONSTRUCT'] = (function(pClassID)
				{
					return function(){
						if(gIsHalted){return;}

						var tClassInfoObject = getClassInfoObject(this);

						if(gIsConstructorCalled[pClassID])
							{halt('SECOND CALL TO CONSTRUCTOR');}
						gIsConstructorCalled[pClassID] = true;
						if(gIsConstructorCalled[gCompiledClasses[pClassID].EXTENDS.CRX_CLASS_ID])
							{halt('UNKNOWN CONSTRUCTION ERROR');}
						tClassInfoObject.CRX_OBJECT_SEGMENTS[gCompiledClasses[pClassID].EXTENDS.CRX_CLASS_ID].CONSTRUCT();
						if(!gIsConstructorCalled[gCompiledClasses[pClassID].EXTENDS.CRX_CLASS_ID])
							{halt('UNKNOWN CONSTRUCTION ERROR');}
						gIsConstructorCalled[gCompiledClasses[pClassID].EXTENDS.CRX_CLASS_ID] = false;
						delete(tClassInfoObject.CRX_OBJECT_SEGMENTS[gCompiledClasses[pClassID].EXTENDS.CRX_CLASS_ID].CONSTRUCT);
					};
				})(pClassID);

				signClassFunction(gClassFTables[pClassID]['pub']['CONSTRUCT'], pClassID);
			}

			return gClassFTables[pClassID]["pub"]["CONSTRUCT"];
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
						
						return pFunction.apply(ftable_this_call__checkAccessToProtectedIsValidAndGetThis(this, pClassID, pKey,
								((gIS_STRICT_JS || gIS_USING_NEW_STATIC_SYNTAX) ? null : gClassFTables[pClassID][pFTableIndex][pKey].caller)), 
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
	function ftable_this_call__checkAccessToProtectedIsValidAndGetThis(pCallerThis, pClassID, pKey, pCaller)
	{
		var vClassInfoObject = getClassInfoObject(pCallerThis);
		var vClassID = getObjectClassIDGivenClassInfoObject(pCallerThis.THIS, vClassInfoObject);

		if(vClassID !== null)
		{
			var vCallerThis = null;

			if(vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[vClassID] === pCallerThis)
				{vCallerThis = pCallerThis;}
			else if(!gIS_STRICT_JS && !gIS_USING_NEW_STATIC_SYNTAX && (vClassInfoObject.CRX_OBJECT_SEGMENTS[vClassID] === pCallerThis) &&
					isCallerFromClassOrAFriend(pCaller, vClassID, true))
				{vCallerThis = vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[vClassID];}

			if(vCallerThis !== null)
			{
				/*var tIsFound = null;

				for(var tKey in vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS)
				{
					if(!vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS.hasOwnProperty(tKey))
						{continue;}

					if(tKey == pClassID)
						{tIsFound = true;}
					if(tIsFound && (tKey == vClassID))
						{return vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[pClassID];}
				}*/
				if(gCompiledClasses[pClassID].DEPTH <= gCompiledClasses[vClassID].DEPTH)
					{return vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[pClassID];}
			}
		}
		halt("ILLEGAL ACCESS TO PROTECTED METHOD '" + getClassNameOrID(gClassDefinitions[pClassID]) + "::" + pKey + "()'", -1);
	}
	function ftable_this_call__virtual(pClassID, pFTableIndex, pKey/*, pFunction*/)
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
							ftable_this_call__virtual__checkAccessToProtectedIsValidAndGetThis(this, pClassID, pKey,
							((gIS_STRICT_JS || gIS_USING_NEW_STATIC_SYNTAX) ? null : gClassFTables[pClassID][pFTableIndex][pKey].caller)),
							arguments);
				}
			})(pClassID, pKey/*, pFunction*/);
		}

		return gClassFTables[pClassID][pFTableIndex][pKey];
	}
	function ftable_this_call__virtual__checkAccessToProtectedIsValidAndGetThis(pCallerThis, pClassID, pKey, pCaller)
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
		if(gClassMemberScopes[vClassID2][pKey] === SCOPE_PRIVATE)
		{
			var tIsInValid = true;

			if(!((vClassID2 === vClassID) && ((vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[vClassID] === pCallerThis) ||
					(!gIS_STRICT_JS && !gIS_USING_NEW_STATIC_SYNTAX && isCallerFromClassOrAFriend(pCaller, vClassID, true)))))
				{halt("ILLEGAL ACCESS TO PRIVATE VIRTUAL METHOD '" + getClassNameOrID(gClassDefinitions[vClassID2]) + "::" + pKey + "()'", -1);}
		}
		else if(gClassMemberScopes[vClassID2][pKey] === SCOPE_PROTECTED)
		{
			var tIsInValid = true;

			if((vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[vClassID] === pCallerThis) ||
					(!gIS_STRICT_JS && !gIS_USING_NEW_STATIC_SYNTAX && isCallerFromClassOrAFriend(pCaller, vClassID, true)))
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
				if(gCompiledClasses[vClassID2].DEPTH <= gCompiledClasses[vClassID].DEPTH)
					{tIsInValid = false;}
			}
			if(tIsInValid)
				{halt("ILLEGAL ACCESS TO PROTECTED VIRTUAL METHOD '" + getClassNameOrID(gClassDefinitions[vClassID2]) + "::" + pKey + "()'", -1);}
		}

		return vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[gClassVTables_lastOccurances[pClassID][pKey]];
	}
	
	/*START: SUPPRT STATIC FUNCTIONS (NON STRICT JS MODE ONLY)*/
	function setThisCallPrivateCapture(pClassID, /*pPrivateThis, pPublicThis, */pKey)
	{
		/*if(gIS_STRICT_JS)
			{return;}*/

		/*function vFunction()
			{return setThisCallPrivateCapture_resolve(this, pClassID, pPrivateThis, pPublicThis, pKey, vFunction.caller);}

		Object.defineProperty(pPublicThis, pKey,
		{
			get: vFunction,
			set: setThisCallPrivateCapture.emptyFunction,
			enumerable: false
		});*/

		function vFunction()
			{return setThisCallPrivateCapture_resolve(this, pClassID, pKey, vFunction.caller);}

		return [vFunction, setThisCallPrivateCapture.emptyFunction];
	}
	setThisCallPrivateCapture.emptyFunction = function(){};
	function setThisCallPrivateCapture_resolve(pThis, pClassID, /*pPrivateThis, pPublicThis,*/ pKey, pCaller)
	{
		var vClassInfoObject = getClassInfoObject(pThis);

		//if(pThis === pPublicThis)
		if(pThis === vClassInfoObject.CRX_OBJECT_SEGMENTS[pClassID])
		{
			if(isCallerFromClassOrAFriend(pCaller, pClassID, true))
			{
				//return pPrivateThis[pKey];
				return vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[pClassID][pKey];
			}
		}
		//else if(pThis !== pPrivateThis)
		else if((pThis !== vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[pClassID]) &&
				vClassInfoObject.CRX_OBJECT_SEGMENTS[pClassID].PARENT &&
				pKey in vClassInfoObject.CRX_OBJECT_SEGMENTS[pClassID].PARENT)
		{
			//var tObject = pPublicThis.PARENT;
			var tObject = vClassInfoObject.CRX_OBJECT_SEGMENTS[pClassID].PARENT;

			while(tObject)
			{
				if(gClassMemberTypes[tObject.CRX_CLASS_ID])
				{
					if(gClassMemberScopes[tObject.CRX_CLASS_ID][pKey] !== SCOPE_PRIVATE)
					{
						if(gClassMemberTypes[tObject.CRX_CLASS_ID].FUNCTIONS[pKey] ||
								gClassMemberTypes[tObject.CRX_CLASS_ID].VARS[pKey])
							{return tObject[pKey];}
					}
					else if(tObject.PARENT && !(pKey in tObject.PARENT))
						{break;}

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
	function static_call(pClassID, pFunction) //THIS ALSO SUPPORTS NEW STATIC SYNTAX
	{
		if(gIS_USING_NEW_STATIC_SYNTAX)
		{
			return function()
			{
				if(gIsHalted){return;}
				//return pFunction.apply(gClassPrivateStatics[pClassID], arguments);
				return pFunction.apply(gClassStaticThis[pClassID], arguments);
			}
		}

		var vCurrentStaticContext = [null, null]
		var vFunction = function()
		{
			if(gIsHalted){return;}

			/*var vReturn = null;
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
			*/

			return pFunction.apply(null, arguments);
		};

		return vFunction;
	}
	function setMemberPrivateCapture(pClassID, /*pPrivateThis, pPublicThis, */pKey)
	{
		if(gIS_STRICT_JS || gIS_USING_NEW_STATIC_SYNTAX)
			{return;}

		/*function vFunction()
			{return setThisCallPrivateCapture_resolve(this, pClassID, pPrivateThis, pPublicThis, pKey, vFunction.caller);}*/
		/*{
			if((this === pPublicThis) && (gStaticContext[0] === pClassID) && (vFunction.caller === gStaticContext[1]))
				{return pPrivateThis[pKey];}
			else
				{return undefined;}
		}*/
		/*function vFunction2(pValue)
			{setMemberPrivateCapture_setter(this, pClassID, pPrivateThis, pPublicThis, pKey, vFunction2.caller, pValue);}*/
		/*{
			if((this === pPublicThis) && (gStaticContext[0] === pClassID) && (vFunction2.caller === gStaticContext[1]))
				{pPrivateThis[pKey] = pValue;}
			else
				{return;}
		}*/

		/*Object.defineProperty(pPublicThis, pKey,
		{
			get: vFunction,
			set: vFunction2,
			enumerable: true
		});*/

		function vFunction()
			{return setThisCallPrivateCapture_resolve(this, pClassID, pKey, vFunction.caller);}
		function vFunction2(pValue)
			{setMemberPrivateCapture_setter(this, pClassID, pKey, vFunction2.caller, pValue);}

		return [vFunction, vFunction2];
	}
	function setMemberPrivateCapture_setter(pThis, pClassID, /*pPrivateThis, pPublicThis, */pKey, pCaller, pValue)
	{
		var vClassInfoObject = getClassInfoObject(pThis);

		//if(pThis === pPublicThis)
		if(pThis === vClassInfoObject.CRX_OBJECT_SEGMENTS[pClassID])
		{
			if(isCallerFromClassOrAFriend(pCaller, pClassID, true))
			{
				//pPrivateThis[pKey] = pValue;
				vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[pClassID][pKey] = pValue;
			}
		}
		//else if(pThis !== pPrivateThis)
		else if(pThis !== vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[pClassID])
		{
			//var tObject = pPublicThis.PARENT;
			var tObject = vClassInfoObject.CRX_OBJECT_SEGMENTS[pClassID].PARENT;

			while(tObject)
			{
				if(gClassMemberTypes[tObject.CRX_CLASS_ID])
				{
					if(gClassMemberScopes[tObject.CRX_CLASS_ID][pKey] !== SCOPE_PRIVATE)
					{
						if(gClassMemberTypes[tObject.CRX_CLASS_ID].FUNCTIONS[pKey] ||
								gClassMemberTypes[tObject.CRX_CLASS_ID].VARS[pKey])
							{tObject[pKey] = pValue;}
					}
					else if(tObject.PARENT && !(pKey in tObject.PARENT))
						{break;}

					tObject = tObject.PARENT;
				}
				else
					{break;}
			}
		}
	}
	/*END: SUPPRT STATIC FUNCTIONS (NON STRICT JS MODE ONLY)*/
	function getClassInfoObject(pObject, pIsToNotCheckForAnnuls)
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
		else if(vReturn.CRX_IS_ANNULED && !pIsToNotCheckForAnnuls)
		{
			if(pObject.CRX_CLASS_ID)
				{halt('INSTANCE OF CLASS "' + getClassNameOrID(gClassDefinitions[pObject.CRX_CLASS_ID]) + '" IS ANNUL', -1);}
			halt('UNKNOWN ERROR');
		}

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
	function getStaticObjectID(pStaticObject)
	{
		var vReturn = null;

		pStaticObject.CRX_STATIC_INFO();
		vReturn = gSecureClassData_return;
		gSecureClassData_return = null;

		if(vReturn === null)
			{halt('SECURITY ERROR, ACCESS VIOLATION');}

		return vReturn.CRX_CLASS_ID;
	}
	
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
	function inspectClassDefinition_processVerboseDefinition(pClassDefinition, pIsStructure)
	{
		if((!pIsStructure && (gClassesWithVerboseDefinitions[pClassDefinition.CRX_CLASS_ID] !== undefined)) ||
				(pIsStructure && (gStructuresWithVerboseDefinitions[pClassDefinition.CRX_STRUCTURE_ID] !== undefined)))
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
							else if(tKeys[tI] === "CONST")
								{tKeys[tI] = "CONSTS";}

							if(!tClass2[tKeys[tI]])
								{tClass2[tKeys[tI]] = {};}
							tClass2 = tClass2[tKeys[tI]];
						}
					}

					tClass2[tKeys[tKeys.length - 1]] = pClassDefinition[tKey2];
				}
				gFunc_freezeObject(tClass);
				
				if(!pIsStructure)
				{
					gClassesWithVerboseDefinitions[pClassDefinition.CRX_CLASS_ID] = pClassDefinition;
					gClassDefinitions[pClassDefinition.CRX_CLASS_ID] = tClass;
				}
				else
				{
					gStructuresWithVerboseDefinitions[pClassDefinition.CRX_STRUCTURE_ID] = pClassDefinition;
					gStructureDefinitions[pClassDefinition.CRX_STRUCTURE_ID] = tClass;
				}
			}
			else
			{
				if(!pIsStructure)
				{
					gClassDefinitions[pClassDefinition.CRX_CLASS_ID] = pClassDefinition;
					gClassesWithVerboseDefinitions[pClassDefinition.CRX_CLASS_ID] = null;
				}
				else
				{
					gStructureDefinitions[pClassDefinition.CRX_STRUCTURE_ID] = pClassDefinition;
					gStructuresWithVerboseDefinitions[pClassDefinition.CRX_STRUCTURE_ID] = null;
				}
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

		gClassFriends[pClass.CRX_CLASS_ID] = {};
		gClassFriends[pClass.CRX_CLASS_ID][pClass.CRX_CLASS_ID] = true;

		if(pClass.hasOwnProperty('FRIENDS'))
		{
			if(getType(pClass["FRIENDS"]) !== "array")
			{
				pErrors.push("'FRIENDS' DEFINITION FOR CLASS '" + getClassNameOrID(pClass) +
						"' IS NOT AN ARRAY");
			}
			else
			{
				for(var tI = 0; tI < pClass["FRIENDS"].length; tI++)
				{
					var tClass = getClassDefinition(pClass["FRIENDS"][tI]);

					if(tClass === null)
					{
						pErrors.push('MISSING DEFINITION FOR THE CLASS "??' + pClass["FRIENDS"][tI] + '??" THAT IS FRIENDED BY CLASS "' + 
								getClassNameOrID(pClass) + '"');
					}
					else
						{gClassFriends[pClass.CRX_CLASS_ID][tClass.CRX_CLASS_ID] = true;}
				}
			}
		}

		parseClass(gClassDefinitions[pClass.CRX_CLASS_ID], pErrors, pWarnings, pParsingData.virtuals, pParsingData.nonVirtuals, 
				pParsingData.virtualFinalFunctions, pParsingData.remainingAbstractVirtuals);
	
		gParsingData[pClass.CRX_CLASS_ID] = {};
		gParsingData[pClass.CRX_CLASS_ID]['virtuals'] = {};
		gParsingData[pClass.CRX_CLASS_ID]['nonVirtuals'] = {};
		gParsingData[pClass.CRX_CLASS_ID]['virtualFinalFunctions'] = {};
		gParsingData[pClass.CRX_CLASS_ID]['remainingAbstractVirtuals'] = {p:{}, length:0};
		mergeToObject(gParsingData[pClass.CRX_CLASS_ID].virtuals, pParsingData.virtuals);
		mergeToObject(gParsingData[pClass.CRX_CLASS_ID].nonVirtuals, pParsingData.nonVirtuals);
		mergeToObject(gParsingData[pClass.CRX_CLASS_ID].virtualFinalFunctions, pParsingData.virtualFinalFunctions);
		mergeToObject(gParsingData[pClass.CRX_CLASS_ID].remainingAbstractVirtuals.p, pParsingData.remainingAbstractVirtuals.p);
		gParsingData[pClass.CRX_CLASS_ID].remainingAbstractVirtuals.length = pParsingData.remainingAbstractVirtuals.length;
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
						if(gClassMemberScopes[pCompiledClass.CRX_CLASS_ID][tKey2] !== SCOPE_PUBLIC)
						{
							pErrors.push("FUNCTION '" + getClassNameOrID(gClassDefinitions[pCompiledClass.CRX_CLASS_ID]) + "::" + 
									tKey2 + "()', WHICH IS REQUIRED BY INTERFACE '" + 
									getInterfaceNameOrID(gInterfaceDefinitions[gInterfaceBuilds[tKey].functions[tKey2]]) + "', MUST BE PUBLIC");
						}
					}
					else
					{
						if(gClassMemberScopes[gClassVTables_lastOccurances[pCompiledClass.CRX_CLASS_ID][tKey2]][tKey2] !== SCOPE_PUBLIC)
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
							if(gClassMemberScopes[pCompiledClass.CRX_CLASS_ID][tKey2] !== SCOPE_PUBLIC)
							{
								pErrors.push("FUNCTION '" + getClassNameOrID(gClassDefinitions[pCompiledClass.CRX_CLASS_ID]) + "::" + 
										tKey2 + "()' IS REQUIRED BY INTERFACES, HENCE MUST REMAIN PUBLIC.");
							}
						}
						else
						{
							if(gClassMemberScopes[gClassVTables_lastOccurances[pCompiledClass.CRX_CLASS_ID][tKey2]][tKey2] !== SCOPE_PUBLIC)
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
					(tKey === "CRX_CLASS_ID") || (tKey === "CRX_CLASS_NAME") || (tKey === "FRIENDS"))
				{}
			else if(tKey === "CRXOOP_DIRECTIVES")
			{
				if(getType(pClass["CRXOOP_DIRECTIVES"]) !== "array")
					{pErrors.push("'CRXOOP_DIRECTIVES' DEFINITION FOR CLASS '" + vClassNameOrID + "' IS NOT AN ARRAY");}
			}
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

				if(tKey === "CONSTS")
					{parseClass_consts(pClassNameOrID, pErrors, 'PRIVATE CONSTS', pClassStructure['CONSTS'], pVirtuals, pMembers);}
				else if(tKey === "VARS")
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
						else if(tKey2 === "FINAL")
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
						}
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

				if(tKey === "CONSTS")
					{parseClass_consts(pClassNameOrID, pErrors, 'PUBLIC CONSTS', pClassStructure['CONSTS'], pVirtuals, pMembers);}
				else if(tKey === "VARS")
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
					((pClassStructure[tKey] === 1) || isInvalidFunction(pErrors, pClassNameOrID, "PUBLIC", tKey,
							pClassStructure[tKey], false));
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
	function parseClass_consts(pClassNameOrID, pErrors, pScope, pClassStructure, pVirtuals, pMembers)
	{
		if(!gAreSettersAndGettersSupported && (pScope.indexOf("PRIVATE") > -1))
			{pErrors.push(pClassNameOrID + "::" + "CONSTS =>" + '"' + pScope + " CAN NOT BE SUPPORTED ON THIS BROWSER");}
		else
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
	}
	function parseClass_vars(pClassNameOrID, pErrors, pScope, pClassStructure, pVirtuals, pMembers)
	{
		if(!gAreSettersAndGettersSupported && (((pScope.indexOf("PUBLIC") > -1) && (pScope.indexOf("STATIC") < 0)) ||
				((pScope.indexOf("PRIVATE") > -1) && (pScope.indexOf("STATIC") > -1))))
			{pErrors.push(pClassNameOrID + "::" + "VARS =>" + '"' + pScope + " CAN NOT BE SUPPORTED ON THIS BROWSER");}
		else
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
				if(gIS_STRICT_JS && !gIS_USING_NEW_STATIC_SYNTAX)
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
	function isIllegalClassMemberName(pErrors, pClassNameOrID, pSectionName, pMemberName, pIsStructure)
	{
		/*if((pMemberName === "PUBLIC") || (pMemberName === "PRIVATE") || (pMemberName === "PROTECTED") ||
				(pMemberName === "CONSTRUCT") || (pMemberName === "VIRTUAL") ||
				(pMemberName === "IMPLEMENTS") || (pMemberName === "SHARED") ||
				(pMemberName === "PARENT") || (pMemberName === "STATIC") ||
				(pMemberName === "CRX_CLASS_INFO") || (pMemberName === "CAST") ||
				(pMemberName === "SELF") || (pMemberName === "VARS") || (pMemberName === "FUNCTIONS") ||
				(pMemberName === "VAR") || (pMemberName === "FUNCTION") || (pMemberName === "SR") ||
				(pMemberName === "CRX_CLASS_ID") ||(pMemberName === "O") ||
				(pMemberName === "CRX_DEFINITION") || (pMemberName === "FINAL") || (pMemberName === "CONST") ||
				(pMemberName === "CONSTS") || (pMemberName === "CRX_INTERFACE_ID") || (pMemberName === "CRX_STRUCTURE_ID") ||
				(pMemberName === "CRX_STRUCTURE_ID_PV") || (pMemberName === "CRX_CLASS_NAME") ||
				(pMemberName === "CRX_STRUCTURE_NAME") || (pMemberName === "CRX_STRUCTURE_INFO") || 
				(pMemberName === "HASOWN"))*/
		if(isIllegalClassMemberName.illegalNames.hasOwnProperty(pMemberName))
		{
			pErrors.push("ILEGAL USE OF KEYWORD '" + pMemberName + "' IN " + (!pIsStructure ? "CLASS" : "STRUCTURE") + " '" +
					pClassNameOrID + "' IN SECTION " + "[" + pSectionName + "]");

			return true;
		}
		return false;
	}
	isIllegalClassMemberName.illegalNames = {"PUBLIC": true, "PRIVATE": true, "PROTECTED": true,
			"CONSTRUCT": true, "VIRTUAL": true, "IMPLEMENTS": true, 'SHARED': true,
			"PARENT": true, "STATIC": true, "CRX_CLASS_INFO": true, "CAST": true,
			"SELF": true, "VARS": true, "FUNCTIONS": true, "VAR": true, "FUNCTION": true, "SR": true,
			"CRX_CLASS_ID": true , "O": true, "CRX_DEFINITION": true, "FINAL": true, "CONST": true,
			"CONSTS": true, "CRX_INTERFACE_ID": true, "CRX_STRUCTURE_ID": true, "CRX_STRUCTURE_ID_PV": true,
			"CRX_CLASS_NAME": true, "CRX_STRUCTURE_NAME": true, 'CRX_STRUCTURE_INFO': true, "HASOWN": true,
			"FRIENDS": true, "CRX_FUNCTION_ID": true, "CRX_STATIC_INFO": true};
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
			PROTECTED: null,
			DIRECTIVE_NO_PUBLIC_VARS_DELEGATION: false,
			DEPTH: 1
		};
		var tKey = null;
		var vClassMemberScopes = {};
		var vClassMemberTypes = //USES 1 FOR INSTANCE MEMBER.  2 FOR VIRTUAL.  3 FOR ABSTRACT VIRTUAL.
		{
			VARS: {},
			FUNCTIONS: {}
		};
		
		vCompiledClass.CRX_CLASS_ID = pClass.CRX_CLASS_ID;
		if(pClass.hasOwnProperty("CRXOOP_DIRECTIVES"))
		{
			for(var tI = 0; tI < pClass["CRXOOP_DIRECTIVES"].length; tI++)
			{
				if(pClass["CRXOOP_DIRECTIVES"][tI] === DIRECTIVE_NO_PUBLIC_VARS_WRITE_DELEGATION)
					{vCompiledClass.DIRECTIVE_NO_PUBLIC_VARS_DELEGATION = true;}
			}
		}
		if(pClass.hasOwnProperty("EXTENDS"))
		{
			vCompiledClass.EXTENDS = gCompiledClasses[getClassID(pClass["EXTENDS"])];
			vCompiledClass.DEPTH = vCompiledClass.EXTENDS.DEPTH + 1;
		}
		if(pClass.hasOwnProperty("IMPLEMENTS"))
			{vCompiledClass.IMPLEMENTS = pClass["IMPLEMENTS"];}
		if(pClass.hasOwnProperty("PUBLIC"))
		{
			vCompiledClass.PUBLIC_CONSTS = [];
			vCompiledClass.PUBLIC_VARS = [];
			vCompiledClass.PUBLIC_FUNCTIONS = [];
			vCompiledClass.PUBLIC_VIRTUAL = null;
			vCompiledClass.PUBLIC_VIRTUAL_FUNCTIONS = [];
			vCompiledClass.PUBLIC_CONSTRUCT = null;

			if(gAreConstantsToBeCopiedToObjects && pClass["PUBLIC"].hasOwnProperty("CONSTS"))
			{
				for(tKey in pClass["PUBLIC"]["CONSTS"])
				{
					if(pClass["PUBLIC"]["CONSTS"].hasOwnProperty(tKey))
						{vCompiledClass.PUBLIC_CONSTS.push([tKey, pClass["PUBLIC"]["CONSTS"][tKey]]);}
				}
			}
			if(pClass["PUBLIC"].hasOwnProperty("VARS"))
			{
				for(tKey in pClass["PUBLIC"]["VARS"])
				{
					if(pClass["PUBLIC"]["VARS"].hasOwnProperty(tKey))
					{
						if(vCompiledClass.DIRECTIVE_NO_PUBLIC_VARS_DELEGATION)
							{vCompiledClass.PUBLIC_VARS.push([tKey, crxOop_var(pClass["PUBLIC"]["VARS"][tKey])]);}
						else
						{
							vCompiledClass.PUBLIC_VARS.push([tKey, crxOop_var(pClass["PUBLIC"]["VARS"][tKey]), (function(pClassID, pKey)
							{
								return function()
									{return getClassInfoObject(this).CRX_PRIVATE_OBJECT_SEGMENTS[pClassID][pKey];}
							})(pClass.CRX_CLASS_ID, tKey), 
							(function(pClassID, pKey)
							{
								return function(pValue)
									{getClassInfoObject(this).CRX_PRIVATE_OBJECT_SEGMENTS[pClassID][pKey] = pValue;}
							})(pClass.CRX_CLASS_ID, tKey)]);
						}

						vClassMemberScopes[tKey] = SCOPE_PUBLIC;
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
						vClassMemberScopes[tKey] = SCOPE_PUBLIC;
						vClassMemberTypes.FUNCTIONS[tKey] = 1;
						signClassFunction(pClass["PUBLIC"]["FUNCTIONS"][tKey], pClass.CRX_CLASS_ID);
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
							{
								vClassMemberTypes.FUNCTIONS[tKey] = 2;
								signClassFunction(pClass["PUBLIC"]["VIRTUAL"]["FUNCTIONS"][tKey], pClass.CRX_CLASS_ID);
							}
							else
								{vClassMemberTypes.FUNCTIONS[tKey] = 3;}

							vClassMemberScopes[tKey] = SCOPE_PUBLIC;
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
							vClassMemberScopes[tKey] = SCOPE_PUBLIC;
							vClassMemberTypes.FUNCTIONS[tKey] = 2;
							signClassFunction(pClass["PUBLIC"]["VIRTUAL"]["FINAL"]["FUNCTIONS"][tKey], pClass.CRX_CLASS_ID);
						}
					}
				}
				if(vCompiledClass.PUBLIC_VIRTUAL_FUNCTIONS.length > 0)
						{vCompiledClass.PUBLIC_VIRTUAL = true;}
			}
			if(pClass["PUBLIC"].hasOwnProperty("CONSTRUCT"))
			{
				if(pClass["PUBLIC"]["CONSTRUCT"] === 1)
				{
					if(vCompiledClass.EXTENDS)
					{
						vCompiledClass.PUBLIC_CONSTRUCT = function()
						{
							if(this.PARENT.CONSTRUCT)
								{this.PARENT.CONSTRUCT.apply(this.PARENT, arguments);}
						};
					}
				}
				else
					{vCompiledClass.PUBLIC_CONSTRUCT = pClass["PUBLIC"]["CONSTRUCT"];}
			}
			if((vCompiledClass.PUBLIC_VARS.length > 0) || (vCompiledClass.PUBLIC_FUNCTIONS.length > 0) ||
					(vCompiledClass.PUBLIC_VIRTUAL) || (vCompiledClass.PUBLIC_CONSTRUCT))
				{vCompiledClass.PUBLIC = true;}
		}
		if(pClass.hasOwnProperty("PRIVATE"))
		{
			vCompiledClass.PRIVATE_CONSTS = [];
			vCompiledClass.PRIVATE_VARS = [];
			vCompiledClass.PRIVATE_FUNCTIONS = [];
			vCompiledClass.PRIVATE_VIRTUAL = null;
			vCompiledClass.PRIVATE_VIRTUAL_FUNCTIONS = [];

			if(gAreConstantsToBeCopiedToObjects && pClass["PRIVATE"].hasOwnProperty("CONSTS"))
			{
				for(tKey in pClass["PRIVATE"]["CONSTS"])
				{
					if(pClass["PRIVATE"]["CONSTS"].hasOwnProperty(tKey))
						{vCompiledClass.PRIVATE_CONSTS.push([tKey, pClass["PRIVATE"]["CONSTS"][tKey]]);}
				}
			}
			if(pClass["PRIVATE"].hasOwnProperty("VARS"))
			{
				for(tKey in pClass["PRIVATE"]["VARS"])
				{
					if(pClass["PRIVATE"]["VARS"].hasOwnProperty(tKey))
					{
						if(gIS_STRICT_JS || gIS_USING_NEW_STATIC_SYNTAX)
							{vCompiledClass.PRIVATE_VARS.push([tKey, crxOop_var(pClass["PRIVATE"]["VARS"][tKey])]);}
						else
						{
							var tGetterAndSetter = setMemberPrivateCapture(pClass.CRX_CLASS_ID, tKey);

							vCompiledClass.PRIVATE_VARS.push([tKey, crxOop_var(pClass["PRIVATE"]["VARS"][tKey]), tGetterAndSetter[0], 
									tGetterAndSetter[1]]);
						}
						vClassMemberScopes[tKey] = SCOPE_PRIVATE;
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
						if(gIS_STRICT_JS || gIS_USING_NEW_STATIC_SYNTAX)
							{vCompiledClass.PRIVATE_FUNCTIONS.push([tKey, pClass["PRIVATE"]["FUNCTIONS"][tKey]]);}
						else
						{
							var tGetterAndSetter = setThisCallPrivateCapture(pClass.CRX_CLASS_ID, tKey);
							
							vCompiledClass.PRIVATE_FUNCTIONS.push([tKey, pClass["PRIVATE"]["FUNCTIONS"][tKey], tGetterAndSetter[0],
									tGetterAndSetter[1]]);
						}
						vClassMemberScopes[tKey] = SCOPE_PRIVATE;
						vClassMemberTypes.FUNCTIONS[tKey] = 1;
						signClassFunction(pClass["PRIVATE"]["FUNCTIONS"][tKey], pClass.CRX_CLASS_ID);
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
							{
								vClassMemberTypes.FUNCTIONS[tKey] = 2;
								signClassFunction(pClass["PRIVATE"]["VIRTUAL"]["FUNCTIONS"][tKey], pClass.CRX_CLASS_ID);
							}
							else
								{vClassMemberTypes.FUNCTIONS[tKey] = 3;}

							vClassMemberScopes[tKey] = SCOPE_PRIVATE;
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
							vClassMemberScopes[tKey] = SCOPE_PRIVATE;
							vClassMemberTypes.FUNCTIONS[tKey] = 2;
							signClassFunction(pClass["PRIVATE"]["VIRTUAL"]["FINAL"]["FUNCTIONS"][tKey], pClass.CRX_CLASS_ID);
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
						{vCompiledClass.PROTECTED_VARS.push([tKey, crxOop_var(pClass["PROTECTED"]["VARS"][tKey])]);}
				}
			}*/
			if(pClass["PROTECTED"].hasOwnProperty("FUNCTIONS"))
			{
				for(tKey in pClass["PROTECTED"]["FUNCTIONS"])
				{
					if(pClass["PROTECTED"]["FUNCTIONS"].hasOwnProperty(tKey))
					{
						vCompiledClass.PROTECTED_FUNCTIONS.push([tKey, pClass["PROTECTED"]["FUNCTIONS"][tKey]]);
						vClassMemberScopes[tKey] = SCOPE_PROTECTED;
						vClassMemberTypes.FUNCTIONS[tKey] = 1;
						signClassFunction(pClass["PROTECTED"]["FUNCTIONS"][tKey], pClass.CRX_CLASS_ID);
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
							{
								vClassMemberTypes.FUNCTIONS[tKey] = 2;
								signClassFunction(pClass["PROTECTED"]["VIRTUAL"]["FUNCTIONS"][tKey], pClass.CRX_CLASS_ID);
							}
							else
								{vClassMemberTypes.FUNCTIONS[tKey] = 3;}

							vClassMemberScopes[tKey] = SCOPE_PROTECTED;
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
							vClassMemberScopes[tKey] = SCOPE_PROTECTED;
							vClassMemberTypes.FUNCTIONS[tKey] = 2;
							signClassFunction(pClass["PROTECTED"]["VIRTUAL"]["FINAL"]["FUNCTIONS"][tKey], pClass.CRX_CLASS_ID);
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
	];
	function buildStatics(pClass)
	{
		if(gClassPublicStatics[pClass.CRX_CLASS_ID] === undefined)
		{
			var tAreTherePublicStaticVarsToBeDelegated = false;
			
			if(gIS_USING_NEW_STATIC_SYNTAX)
			{
				gClassStaticThis[pClass.CRX_CLASS_ID] = {};
			}

			if(pClass.hasOwnProperty("PUBLIC"))
			{
				if(pClass['PUBLIC'].hasOwnProperty("CONSTS") || pClass['PUBLIC'].hasOwnProperty("STATIC"))
					{gClassPublicStatics[pClass.CRX_CLASS_ID] = {};}
				else
					{gClassPublicStatics[pClass.CRX_CLASS_ID] = null;}

				if(pClass['PUBLIC'].hasOwnProperty("CONSTS"))
				{
					for(var tKey in pClass["PUBLIC"]["CONSTS"])
					{
						if(!pClass["PUBLIC"]["CONSTS"].hasOwnProperty(tKey))
							{continue;}

						setObjectReadOnlyMember(gClassPublicStatics[pClass.CRX_CLASS_ID], tKey, pClass["PUBLIC"]["CONSTS"][tKey]);
					}
				}

				if(pClass['PUBLIC'].hasOwnProperty("STATIC"))
				{
					if(pClass["PUBLIC"]["STATIC"].hasOwnProperty("VARS"))
					{
						for(var tKey in pClass["PUBLIC"]["STATIC"]["VARS"])
						{
							if(!pClass["PUBLIC"]["STATIC"]["VARS"].hasOwnProperty(tKey))
								{continue;}

							if(gCompiledClasses[pClass.CRX_CLASS_ID].DIRECTIVE_NO_PUBLIC_VARS_DELEGATION)
								{gClassPublicStatics[pClass.CRX_CLASS_ID][tKey] = pClass["PUBLIC"]["STATIC"]["VARS"][tKey];}
							else
							{
								tAreTherePublicStaticVarsToBeDelegated = true;
								Object.defineProperty(gClassPublicStatics[pClass.CRX_CLASS_ID], tKey, 
								{
									"get": (function(pClassID, pKey)
									{
										return function()
											{return gClassPrivateStatics[pClass.CRX_CLASS_ID][pKey];}
									})(pClass.CRX_CLASS_ID, tKey), 
									"set": (function(pClassID, pKey)
									{
										return function(pValue)
											{gClassPrivateStatics[pClass.CRX_CLASS_ID][pKey] = pValue;}
									})(pClass.CRX_CLASS_ID, tKey),
									"enumerable": true
								});
							}
						}
					}
					if((!gIS_STRICT_JS || gIS_USING_NEW_STATIC_SYNTAX) && pClass["PUBLIC"]["STATIC"].hasOwnProperty("FUNCTIONS"))
					{
						for(var tKey in pClass["PUBLIC"]["STATIC"]["FUNCTIONS"])
						{
							if(!pClass["PUBLIC"]["STATIC"]["FUNCTIONS"].hasOwnProperty(tKey))
								{continue;}

							setObjectReadOnlyMember(gClassPublicStatics[pClass.CRX_CLASS_ID],
									tKey, static_call(pClass.CRX_CLASS_ID, pClass["PUBLIC"]["STATIC"]["FUNCTIONS"][tKey]));
							signClassFunction(pClass["PUBLIC"]["STATIC"]["FUNCTIONS"][tKey], pClass.CRX_CLASS_ID, true);
						}
					}
				}
			}
			else
				{gClassPublicStatics[pClass.CRX_CLASS_ID] = null;}
			
			if(gIS_USING_NEW_STATIC_SYNTAX && gClassPublicStatics[pClass.CRX_CLASS_ID])
				{gClassPrivateStatics[pClass.CRX_CLASS_ID] = gFunc_createObject(gClassPublicStatics[pClass.CRX_CLASS_ID]);}

			if(pClass.hasOwnProperty("PRIVATE"))
			{
				if(gClassPrivateStatics[pClass.CRX_CLASS_ID] === undefined)
				{
					if(tAreTherePublicStaticVarsToBeDelegated || 
							pClass['PRIVATE'].hasOwnProperty("CONSTS") || 
							pClass['PRIVATE'].hasOwnProperty("STATIC"))
					{
						if(gClassPublicStatics[pClass.CRX_CLASS_ID] === null)
							{gClassPrivateStatics[pClass.CRX_CLASS_ID] = {};}
						else
						{
							gClassPrivateStatics[pClass.CRX_CLASS_ID] =
									gFunc_createObject(gClassPublicStatics[pClass.CRX_CLASS_ID]);
						}
					}
					else
						{gClassPrivateStatics[pClass.CRX_CLASS_ID] = null;}
				}

				if(pClass['PRIVATE'].hasOwnProperty("CONSTS"))
				{
					for(var tKey in pClass["PRIVATE"]["CONSTS"])
					{
						if(!pClass["PRIVATE"]["CONSTS"].hasOwnProperty(tKey))
							{continue;}

						setObjectReadOnlyMember(gClassPrivateStatics[pClass.CRX_CLASS_ID], tKey, pClass["PRIVATE"]["CONSTS"][tKey]);
					}
				}

				if(pClass['PRIVATE'].hasOwnProperty("STATIC"))
				{
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
					if((!gIS_STRICT_JS || gIS_USING_NEW_STATIC_SYNTAX) && pClass["PRIVATE"]["STATIC"].hasOwnProperty("FUNCTIONS"))
					{
						for(var tKey in pClass["PRIVATE"]["STATIC"]["FUNCTIONS"])
						{
							if(!pClass["PRIVATE"]["STATIC"]["FUNCTIONS"].hasOwnProperty(tKey))
								{continue;}

							setObjectReadOnlyMember(gClassPrivateStatics[pClass.CRX_CLASS_ID],
									tKey, static_call(pClass.CRX_CLASS_ID, pClass["PRIVATE"]["STATIC"]["FUNCTIONS"][tKey]));
							signClassFunction(pClass["PRIVATE"]["STATIC"]["FUNCTIONS"][tKey], pClass.CRX_CLASS_ID, true);
						}
					}
				}
			
				if(tAreTherePublicStaticVarsToBeDelegated)
				{
					for(var tKey in pClass["PUBLIC"]["STATIC"]["VARS"])
					{
						if(!pClass["PUBLIC"]["STATIC"]["VARS"].hasOwnProperty(tKey))
							{continue;}

						Object.defineProperty(gClassPrivateStatics[pClass.CRX_CLASS_ID], tKey, 
						{
							"value": pClass["PUBLIC"]["STATIC"]["VARS"][tKey],
							"writable": true,
							"enumerable": true
						});
					}
				}
			}
			
			if(gIS_USING_NEW_STATIC_SYNTAX && gClassPrivateStatics[pClass.CRX_CLASS_ID])
			{
				setObjectReadOnlyMember(gClassStaticThis[pClass.CRX_CLASS_ID], "O", _this__STATIC(pClass.CRX_CLASS_ID));
				//setObjectReadOnlyMember(gClassStaticThis[pClass.CRX_CLASS_ID], "C", _class__STATIC);
				
				setObjectReadOnlyMember(gClassStaticThis[pClass.CRX_CLASS_ID], "CRX_STATIC_INFO", secureClassData(
				{
					'CRX_CLASS_ID': pClass.CRX_CLASS_ID
				}));
				setObjectReadOnlyMember(gClassStaticThis[pClass.CRX_CLASS_ID], "STATIC", gClassPrivateStatics[pClass.CRX_CLASS_ID]);
			}
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
		{
			if(gAreConstantsToBeCopiedToObjects && (gCompiledClasses[vClass.CRX_CLASS_ID].PUBLIC_CONSTS.length > 0))
				{_static__assertPublicConstants(vClass.CRX_CLASS_ID);}

			return (gClassPublicStatics[vClass.CRX_CLASS_ID] || null);
		}
		else
			{return null;}
	}
	function _static__assertPublicConstants(pClassID)
	{
		for(var tI = 0; tI < gCompiledClasses[pClassID].PUBLIC_CONSTS.length; tI++)
		{
			gClassPublicStatics[pClassID][gCompiledClasses[pClassID].PUBLIC_CONSTS[tI][0]] = 
					gCompiledClasses[pClassID].PUBLIC_CONSTS[tI][1];
		}
	}
	function _sr(pClassDefinitionOrClassName, pMemberName)
	{
		if(gIsHalted){return;}

		var vClassID = null;
		var vObject = null;

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
			{halt('UNDECLARED CLASS "??' + pClassDefinitionOrClassName + '??"', -1);}
		if(!vObject)
		{
			halt('CAN NOT RESOLVE MEMBER "' + pMemberName + '" ON CLASS "' +
					getClassNameOrID(gClassDefinitions[vClassID]) + '". INSTANCE CAN NOT BE CASTED TO "' +
					getClassNameOrID(gClassDefinitions[vClassID]) + '"', -1);
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
					var tFunction = ftable_this_call__virtual(vClassID, "puv", pMemberName);

					return tFunction.apply(vObject, Array.prototype.slice.call(arguments, 2));
				}
			}
		}
		else if(gClassMemberTypes[vClassID].VARS[pMemberName])
		{
			if(gClassMemberScopes[vClassID][pMemberName] === SCOPE_PUBLIC)
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
				if(gClassMemberScopes[vClassID][pMemberName] === SCOPE_PUBLIC)
					{return vObject[pMemberName].apply(vObject, Array.prototype.slice.call(arguments, 2));}
				else if(gClassMemberScopes[vClassID][pMemberName] === SCOPE_PROTECTED)
				{
					var tClassInfoObject = getClassInfoObject(this);
					var tClassID = getObjectClassIDGivenClassInfoObject(this.THIS, tClassInfoObject);
					var tObject = this.PARENT;
					
					if((this === tClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[tClassID]) ||
							(!gIS_STRICT_JS && !gIS_USING_NEW_STATIC_SYNTAX && isCallerFromClassOrAFriend(_sr.caller, tClassID, true)))
					{
						return vObject[pMemberName].apply(tClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[vClassID],
								Array.prototype.slice.call(arguments, 2));
					}
				}
			}
			else if(gClassMemberTypes[vClassID].FUNCTIONS[pMemberName] === 2)
			{
				if(gClassMemberScopes[vClassID][pMemberName] !== SCOPE_PRIVATE)
				{
					var tClassInfoObject = getClassInfoObject(this);
					var tClassID = getObjectClassIDGivenClassInfoObject(this.THIS, tClassInfoObject);
					var tObject = this.PARENT;
					var tIsFunctionProtected = false;
					var tIsCallerAllowedProtectedAccess = false;
					
					if((this === tClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[tClassID]) ||
							(!gIS_STRICT_JS && !gIS_USING_NEW_STATIC_SYNTAX && isCallerFromClassOrAFriend(_sr.caller, tClassID, true)))
						{tIsCallerAllowedProtectedAccess = true;}

					while(tObject !== null)
					{
						tClassID = gClassVTables_lastOccurances[getObjectClassIDFast(tObject)][pMemberName] || null;

						if(gClassMemberTypes[tClassID].FUNCTIONS[pMemberName]) //SHOULD ALWAYS EQUAL 2 OR 3
						{
							if((gClassMemberScopes[tClassID][pMemberName] === SCOPE_PROTECTED) || 
									(gClassMemberScopes[tClassID][pMemberName] === SCOPE_PUBLIC))
							{
								if(gClassMemberScopes[tClassID][pMemberName] === SCOPE_PROTECTED)
									{tIsFunctionProtected = true;}

								if(gClassMemberTypes[tClassID].FUNCTIONS[pMemberName] === 2)
								{
									if(tClassID == vClassID)
									{
										if(!tIsFunctionProtected || (tIsCallerAllowedProtectedAccess))
										{
											return ftable_this_call__virtual(vClassID, "puv", pMemberName).
													apply(tClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[vClassID],
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
						//tObject = (tClassInfoObject.CRX_OBJECT_SEGMENTS[tClassID] ? tClassInfoObject.CRX_OBJECT_SEGMENTS[tClassID].PARENT : null);
						tObject = tObject.PARENT;
					}

					/*while(tObject !== null)
					{
						tClassID = getObjectClassIDFast(tObject);

						if(gClassMemberTypes[tClassID].FUNCTIONS[pMemberName]) //SHOULD ALWAYS EQUAL 2 OR 3
						{
							if((gClassMemberScopes[tClassID][pMemberName] === SCOPE_PROTECTED) || 
									(gClassMemberScopes[tClassID][pMemberName] === SCOPE_PUBLIC))
							{
								if(gClassMemberScopes[tClassID][pMemberName] === SCOPE_PROTECTED)
									{tIsFunctionProtected = true;}

								if(gClassMemberTypes[tClassID].FUNCTIONS[pMemberName] === 2)
								{
									if((tClassID == vClassID) &&
											(tObject === tClassInfoObject.CRX_OBJECT_SEGMENTS[tClassID]))
									{
										if(!tIsFunctionProtected || (tIsCallerAllowedProtectedAccess))
										{
											var tFunction = ftable_this_call__virtual(vClassID, "puv", pMemberName);
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
					}*/
				}
			}
		}

		halt('ILLEGAL ACCESS TO, OR UNKNOWN, MEMBER "' + pMemberName + '" IN CLASS "' + getClassNameOrID(gClassDefinitions[vClassID]) + '"', -1);
	}
	function _this(pPrivateThis)
	{
		return function(pObject, pClassDefinitionOrClassName)
		{
			if(gIsHalted){return;}
			return _this_do(this, pPrivateThis, pObject, pClassDefinitionOrClassName);
		}
	}
	function _this_do(pCallerThis, pPrivateThis, pObject, pClassDefinitionOrClassName)
	{
		if(pCallerThis === pPrivateThis)
		{
			var vClassID = getObjectClassID(pCallerThis.THIS);

			if(vClassID !== null)
			{
				if(pClassDefinitionOrClassName === undefined)
					{return getClassInfoObject(pObject).CRX_PRIVATE_OBJECT_SEGMENTS[vClassID] || null;}
				else
				{
					var tObject = pObject.CAST(pClassDefinitionOrClassName);

					if(tObject !== null)
					{
						var tClassInfoObject = getClassInfoObject(tObject);
						var tClassID = getObjectClassIDGivenClassInfoObject(tObject, tClassInfoObject);

						if(gClassFriends[tClassID].hasOwnProperty(vClassID))
							{return tClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[tClassID];}
						else
						{
							halt('ERROR USING \'O\'. CLASS "' + getClassNameOrID(gClassDefinitions[vClassID]) + '" IS NOT BE FRIENDED ' + 
									'BY CLASS "' + getClassNameOrID(gClassDefinitions[tClassID]) + '"', -1);
						}
					}
					else
						{return null;}
				}
			}
		}
		halt("SECURITY ERROR WHILE USING 'O'");
	}
	function _class(pClassDefinitionOrClassName)
	{
		if(gIsHalted){return;}

		var vClass = getClassDefinition(pClassDefinitionOrClassName);
		var vClassInfoObject = getClassInfoObject(this);
		var vClassID = getObjectClassIDGivenClassInfoObject(this.THIS, vClassInfoObject);

		if(vClass === null)
			{return null;}
		prepareClass(vClass);

		if((vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[vClassID] === this) &&
				gClassFriends[vClass.CRX_CLASS_ID].hasOwnProperty(vClassID))
			{return (gClassPrivateStatics[vClass.CRX_CLASS_ID] || gClassPublicStatics[vClass.CRX_CLASS_ID] || null);}
		else
			{return (gClassPublicStatics[vClass.CRX_CLASS_ID] || null);}
	}
	

	/*START: SUPPORT STATIC FUNCTIONS (NON STRICT JS MODE ONLY)*/
	function _static__withStaticFunctionsSupport(pClass)
	{
		if(gIsHalted){return;}

		var vClass = getClassDefinition(pClass);

		if(vClass === null)
			{return null;}
		prepareClass(vClass);

		if(gClassPublicStatics[vClass.CRX_CLASS_ID] || gClassPrivateStatics[vClass.CRX_CLASS_ID])
		{
			if(isCallerFromClassOrAFriend(_static__withStaticFunctionsSupport.caller, vClass.CRX_CLASS_ID, true))
				{return (gClassPrivateStatics[vClass.CRX_CLASS_ID] || gClassPublicStatics[vClass.CRX_CLASS_ID] || null);}
			else
				{return (gClassPublicStatics[vClass.CRX_CLASS_ID] || null);}
		}
		else
			{return null;}
	}
	/*END: SUPPORT STATIC FUNCTIONS (NON STRICT JS MODE ONLY)*/

	/*START: NEW STATIC SYNTAX*/
	function _this__STATIC(pClassID)
	{
		return function(pObject, pClassDefinitionOrClassName)
		{
			if(gIsHalted){return;}
			return _this__STATIC_do(this, pClassID, pObject, pClassDefinitionOrClassName);
		}
	}
	function _this__STATIC_do(pCallerThis, pClassID, pObject, pClassDefinitionOrClassName)
	{
		if(pCallerThis === gClassStaticThis[pClassID])
		{
			if(pClassDefinitionOrClassName === undefined)
				{return getClassInfoObject(pObject).CRX_PRIVATE_OBJECT_SEGMENTS[pClassID] || null;}
			else
			{
				var tObject = pObject.CAST(pClassDefinitionOrClassName);

				if(tObject !== null)
				{
					var tClassInfoObject = getClassInfoObject(tObject);
					var tClassID = getObjectClassIDGivenClassInfoObject(tObject, tClassInfoObject);

					if(gClassFriends[tClassID].hasOwnProperty(pClassID))
						{return tClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[tClassID];}
					else
					{
						halt('ERROR USING \'O\'. CLASS "' + getClassNameOrID(gClassDefinitions[pClassID]) + '" IS NOT BE FRIENDED ' + 
								'BY CLASS "' + getClassNameOrID(gClassDefinitions[tClassID]) + '"', -1);
					}
				}
				else
					{return null;}
			}
		}
		halt("SECURITY ERROR WHILE USING 'O'");
	}
	function _class__STATIC(pClassDefinitionOrClassName)
	{
		if(gIsHalted){return;}

		var vClass = getClassDefinition(pClassDefinitionOrClassName);
		var vClassID = getStaticObjectID(this);

		if(vClass === null)
			{return null;}
		prepareClass(vClass);

		if((gClassStaticThis[pClass.CRX_CLASS_ID][vClassID] === this) &&
				gClassFriends[vClass.CRX_CLASS_ID].hasOwnProperty(vClassID))
			{return (gClassPrivateStatics[vClass.CRX_CLASS_ID] || gClassPublicStatics[vClass.CRX_CLASS_ID] || null);}
		else
			{return (gClassPublicStatics[vClass.CRX_CLASS_ID] || null);}
	}
	/*END: NEW STATIC SYNTAX*/
	
	function _annul()
	{
		var vClassInfoObject = getClassInfoObject(this);
		var vClassID = getObjectClassIDGivenClassInfoObject(this.THIS, vClassInfoObject);

		if(vClassInfoObject.CRX_PRIVATE_OBJECT_SEGMENTS[vClassID] === this)
			{vClassInfoObject.CRX_IS_ANNULED = true;}
		else
			{halt("SECURITY ERROR WHILE USING 'ANNUL'");}

		return vClassInfoObject.CRX_IS_ANNULED;
	}
	function _isAnnul(pObject)
	{
		if(pObject.CRX_CLASS_INFO)
			{return getClassInfoObject(pObject, true).CRX_IS_ANNULED;}
		return false;
	}
	
	function _instanceof(pObject, pClassOrInterfaceOrStructure)
	{
		if(typeof(pObject) === 'string')
			{return false;}

		var vTypeOfObject = _typeOf(pObject);
		var vClassOrInterfaceOrStructure = null;
		var vTypeOfClassOrInterfaceOrStructure = null;//

		if(typeof(pClassOrInterfaceOrStructure) === 'string')
		{
			vClassOrInterfaceOrStructure = getClassDefinition(pClassOrInterfaceOrStructure);
			if(vClassOrInterfaceOrStructure === null)
				{vClassOrInterfaceOrStructure = getInterface(pClassOrInterfaceOrStructure);}
			if(vClassOrInterfaceOrStructure === null)
				{vClassOrInterfaceOrStructure = getStructureDefinition(pClassOrInterfaceOrStructure);}
			if(vClassOrInterfaceOrStructure === null)
				{return false;}
		}
		else
			{vClassOrInterfaceOrStructure = pClassOrInterfaceOrStructure}
		vTypeOfClassOrInterfaceOrStructure = _typeOf(vClassOrInterfaceOrStructure);

		if(vTypeOfObject === "$CRX__native")
		{
			if(vTypeOfClassOrInterfaceOrStructure === "$CRX__native")
				{return (pObject instanceof pClassOrInterfaceOrStructure);}
			return false;
		}
		else if((vTypeOfObject === "$CRX_DEFINITION__INTERFACE") ||
				(vTypeOfObject === "$CRX_DEFINITION__CLASS") ||
				(vTypeOfObject === "$CRX_DEFINITION__STRUCTURE"))
			{return false;}
		else if(vTypeOfObject === "$CRX_OBJECT")
		{
			if(vTypeOfClassOrInterfaceOrStructure === "$CRX_DEFINITION__CLASS")
			{
				var tClass = gClassDefinitions[getObjectClassID(pObject.THIS)];

				while(tClass)
				{
					if(vClassOrInterfaceOrStructure.CRX_CLASS_ID === tClass.CRX_CLASS_ID)
						{return true;}

					if(tClass.hasOwnProperty("EXTENDS"))
						{tClass = getClassDefinition(tClass["EXTENDS"]);}
					else
						{tClass = null;}
				}
				return false;
			}
			else if(vTypeOfClassOrInterfaceOrStructure === "$CRX_DEFINITION__STRUCTURE")
			{
				var tCompiledStructure = gCompiledStructures[pObject.CRX_STRUCTURE_ID];

				if(vClassOrInterfaceOrStructure.CRX_STRUCTURE_ID === pObject.CRX_STRUCTURE_ID)
					{return true;}

				if(tCompiledStructure.SHARED_LIST)
				{
					for(var tI = 0; tI < tCompiledStructure.SHARED_LIST.length; tI++)
					{
						if(vClassOrInterfaceOrStructure.CRX_STRUCTURE_ID === tCompiledStructure.SHARED_LIST[tI])
							{return true;}
					}
				}

				return false;
			}
			else if(vTypeOfClassOrInterfaceOrStructure === "$CRX_DEFINITION__INTERFACE")
			{
				var tClass = gClassDefinitions[getObjectClassID(pObject.THIS)];

				while(tClass)
				{
					if(gClassInterfaceFullTraces[tClass.CRX_CLASS_ID] &&
							gClassInterfaceFullTraces[tClass.CRX_CLASS_ID].hasOwnProperty(vClassOrInterfaceOrStructure.CRX_INTERFACE_ID))
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
			if(pObject.CRX_STRUCTURE_ID && ((gStructureDefinitions[pObject.CRX_STRUCTURE_ID] === pObject) ||
					(gStructuresWithVerboseDefinitions[pObject.CRX_STRUCTURE_ID] === pObject)))
				{return "$CRX_DEFINITION__STRUCTURE";}
		}
		if((pObject.CRX_CLASS_INFO && (getClassInfoObject(pObject) !== null)) || 
				(pObject.CRX_STRUCTURE_INFO && (getStructureInfoObject(pObject) !== null)))
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
			{halt('UNDECLARED CLASS "??' + pClassDefinitionOrClassName1 + '??"', -1);}
		else if(vClass2 === null)
			{halt('UNDECLARED CLASS "??' + pClassDefinitionOrClassName2 + '??"', -1);}
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
			{halt('UNDECLARED INTERFACE "??' + pInterfaceOrInterfaceName + '??"', -1);}
		
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
	function isClassRegistered(pClassDefinitionOrClassName)
		{return (getClassDefinition(pClassDefinitionOrClassName, true) ? true : false);}
	
	function isInterfaceRegistered(pInterfaceOrInterfaceName)
		{return (getInterface(pInterfaceOrInterfaceName) ? true : false);}
	
//STRUCTURES: START
	function _new_buildStructure(pCompiledStructe, pCRX_STRUCTURE_INFOs, pLength)
	{
		var vObjects = [];
		var vObjects_sharedPrivates = [];
		var vPrototypeObject = getStructurePrototype(pCompiledStructe);
		var vIsConstructorFound = false;
		var tObject = null;
		var tI = 0;
		var tI2 = 0;
		var tI3 = 0;
		var tStructureID = -1;
		var tCompiledStructure = null;

		for(tI = 0; tI < pLength; tI++)
		{
			vObjects[tI] = gFunc_createObject(vPrototypeObject);

			pCRX_STRUCTURE_INFOs[tI].CRX_SHARED_SEGMENT = vObjects[tI];
			pCRX_STRUCTURE_INFOs[tI].CRX_SHARED_PRIVATE_SEGMENT = null;
			pCRX_STRUCTURE_INFOs[tI].CRX_PRIVATE_SEGMENTS = {};
			pCRX_STRUCTURE_INFOs[tI].CRX_SHARED_SEGMENTS_DATA = {};
			pCRX_STRUCTURE_INFOs[tI].currentStructureID = -1;

			setObjectReadOnlyMember(vObjects[tI], "CRX_STRUCTURE_INFO", secureClassData(pCRX_STRUCTURE_INFOs[tI]));
			setObjectReadOnlyMember(vObjects[tI], "THIS", vObjects[tI]);
			vObjects[tI]['CONSTRUCT'] = _structureConstruct;
		}
		
		//setObjectsReadOnlyMember(vObjects, "SR", _sr_structure);
		//setObjectsReadOnlyMember(vObjects, "CRX_STRUCTURE_ID", pCompiledStructe.CRX_STRUCTURE_ID);

		if(pCompiledStructe.SHARED)
		{
			if(pCompiledStructe.SHARED_PUBLIC)
			{
				/*for(tI = 0; tI < pCompiledStructe.SHARED_LIST.length; tI++) // WARNING: ORDER HERE IS IMPORTANT.
				{
					tCompiledStructure = gCompiledStructures[pCompiledStructe.SHARED_LIST[tI]];

					for(tI2 = 0; tI2 < tCompiledStructure.SHARED_PUBLIC_VARS.length; tI2++)
					{
						for(tI3 = 0; tI3 < pLength; tI3++)
						{
							vObjects[tI3][tCompiledStructure.SHARED_PUBLIC_VARS[tI2][0]] = tCompiledStructure.SHARED_PUBLIC_VARS[tI2][1];
						}
					}
				}*/
				for(tI = 0; tI < pCompiledStructe.SHARED_ALL_PUBLIC_VARS.length; tI++)
				{
					if(pCompiledStructe.SHARED_PRIVATE || (pCompiledStructe.PRIVATES.length > 0))
					{
						_new_buildStructure.o1.get = pCompiledStructe.SHARED_ALL_PUBLIC_VARS[tI][2];
						_new_buildStructure.o1.set = pCompiledStructe.SHARED_ALL_PUBLIC_VARS[tI][3];

						for(tI2 = 0; tI2 < pLength; tI2++)
						{
							pCRX_STRUCTURE_INFOs[tI2].CRX_SHARED_SEGMENTS_DATA[pCompiledStructe.SHARED_ALL_PUBLIC_VARS[tI][0]] = 
									pCompiledStructe.SHARED_ALL_PUBLIC_VARS[tI][1];
							Object.defineProperty(vObjects[tI2], pCompiledStructe.SHARED_ALL_PUBLIC_VARS[tI][0], _new_buildStructure.o1);
						}
					}
					else
					{
						for(tI2 = 0; tI2 < pLength; tI2++)
							{vObjects[tI2][pCompiledStructe.SHARED_ALL_PUBLIC_VARS[tI][0]] = pCompiledStructe.SHARED_ALL_PUBLIC_VARS[tI][1];}
					}
				}
			}
			if(pCompiledStructe.SHARED_PRIVATE)
			{
				for(tI = 0; tI < pLength; tI++)
				{
					vObjects_sharedPrivates[tI] = gFunc_createObject(vObjects[tI]);
					pCRX_STRUCTURE_INFOs[tI].CRX_SHARED_PRIVATE_SEGMENT = vObjects_sharedPrivates[tI];
				}

				/*for(tI = 0; tI < pCompiledStructe.SHARED_LIST.length; tI++) // WARNING: ORDER HERE IS IMPORTANT.
				{
					tCompiledStructure = gCompiledStructures[pCompiledStructe.SHARED_LIST[tI]];

					for(tI2 = 0; tI2 < tCompiledStructure.SHARED_PRIVATE_VARS.length; tI2++)
					{
						for(tI3 = 0; tI3 < pLength; tI3++)
						{
							vObjects_sharedPrivates[tI3][tCompiledStructure.SHARED_PRIVATE_VARS[tI2][0]] = tCompiledStructure.SHARED_PRIVATE_VARS[tI2][1];
						}
					}

					for(tI2 = 0; tI2 < tCompiledStructure.SHARED_PRIVATE_FUNCTIONS.length; tI2++)
					{
						setObjectsReadOnlyMember(vObjects_sharedPrivates, tCompiledStructure.SHARED_PRIVATE_FUNCTIONS[tI2][0],
								tCompiledStructure.SHARED_PRIVATE_FUNCTIONS[tI2][1]);
					}
				}*/
				
				for(tI = 0; tI < pCompiledStructe.SHARED_ALL_PRIVATE_VARS.length; tI++)
				{
					if(pCompiledStructe.PRIVATES.length > 0)
					{
						_new_buildStructure.o1.get = pCompiledStructe.SHARED_ALL_PRIVATE_VARS[tI][2];
						_new_buildStructure.o1.set = pCompiledStructe.SHARED_ALL_PRIVATE_VARS[tI][3];

						for(tI2 = 0; tI2 < pLength; tI2++)
						{
							pCRX_STRUCTURE_INFOs[tI2].CRX_SHARED_SEGMENTS_DATA[pCompiledStructe.SHARED_ALL_PRIVATE_VARS[tI][0]] = 
									pCompiledStructe.SHARED_ALL_PRIVATE_VARS[tI][1];
							Object.defineProperty(vObjects[tI2], pCompiledStructe.SHARED_ALL_PRIVATE_VARS[tI][0], _new_buildStructure.o1);
						}
					}
					else
					{
						for(tI2 = 0; tI2 < pLength; tI2++)
						{
							vObjects_sharedPrivates[tI2][pCompiledStructe.SHARED_ALL_PRIVATE_VARS[tI][0]] =
									pCompiledStructe.SHARED_ALL_PRIVATE_VARS[tI][1];
						}
					}
				}
				for(tI = 0; tI < pCompiledStructe.SHARED_ALL_PRIVATE_FUNCTIONS.length; tI++)
				{
					setObjectsReadOnlyMember(vObjects_sharedPrivates, pCompiledStructe.SHARED_ALL_PRIVATE_FUNCTIONS[tI][0],
							pCompiledStructe.SHARED_ALL_PRIVATE_FUNCTIONS[tI][1], true);
				}

				setObjectsReadOnlyMember(vObjects_sharedPrivates, "O", _this_structure_shared);
			}
			else
			{
				for(tI = 0; tI < pLength; tI++)
					{pCRX_STRUCTURE_INFOs[tI].CRX_SHARED_PRIVATE_SEGMENT = vObjects[tI];}
			}
		}
		else
		{
			for(tI = 0; tI < pLength; tI++)
				{pCRX_STRUCTURE_INFOs[tI].CRX_SHARED_PRIVATE_SEGMENT = vObjects[tI];}
		}
		
		for(tI = 0; tI < pLength; tI++)
		{
			for(tI2 = 0; tI2 < pCompiledStructe.SHARED_LIST.length; tI2++)
			{
				pCRX_STRUCTURE_INFOs[tI].CRX_PRIVATE_SEGMENTS[pCompiledStructe.SHARED_LIST[tI2]] = 
						pCRX_STRUCTURE_INFOs[tI].CRX_SHARED_PRIVATE_SEGMENT;
			}
		}

		for(tI = 0; tI < pCompiledStructe.PRIVATES.length; tI++)
		{
			tStructureID = pCompiledStructe.PRIVATES[tI];

			for(tI2 = 0; tI2 < pLength; tI2++)
			{
				tObject = gFunc_createObject(pCRX_STRUCTURE_INFOs[tI2].CRX_SHARED_PRIVATE_SEGMENT);
				pCRX_STRUCTURE_INFOs[tI2].CRX_PRIVATE_SEGMENTS[tStructureID] = tObject;

				for(tI3 = 0; tI3 < gCompiledStructures[tStructureID].PRIVATE_VARS.length; tI3++)
				{
					tObject[gCompiledStructures[tStructureID].PRIVATE_VARS[tI3][0]] = 
							gCompiledStructures[tStructureID].PRIVATE_VARS[tI3][1];
				}

				for(tI3 = 0; tI3 < gCompiledStructures[tStructureID].PRIVATE_FUNCTIONS.length; tI3++)
				{
					setObjectReadOnlyMember(tObject, gCompiledStructures[tStructureID].PRIVATE_FUNCTIONS[tI3][0],  
							gCompiledStructures[tStructureID].PRIVATE_FUNCTIONS[tI3][1]);
				}

				setObjectReadOnlyMember(tObject, 'O', _this_structure(tObject, tStructureID));
				setObjectReadOnlyMember(tObject, 'CRX_STRUCTURE_ID_PV', tStructureID);
			}
		}

		return vObjects;
	}
	_new_buildStructure.o1 = {"get": null, "set": null, enumerable: true};

	function this_call__structureConstructor(pStructureID, pFunction)
	{
		if(gStructureFTables[pStructureID] && gStructureFTables[pStructureID]["pub"] &&
				gStructureFTables[pStructureID]["pub"]["CONSTRUCT"])
			{return gStructureFTables[pStructureID]["pub"]["CONSTRUCT"];}
		else
		{
			if(!gStructureFTables[pStructureID])
				{gStructureFTables[pStructureID] = {};}
			if(!gStructureFTables[pStructureID]["pub"])
				{gStructureFTables[pStructureID]["pub"] = {};}

			if(pFunction)
			{
				gStructureFTables[pStructureID]["pub"]["CONSTRUCT"] = (function(pStructureID, pFunction)
				{
					return function(){
						if(gIsHalted){return;}

						var vSharedInfoObject = getStructureInfoObject(this);
						var vStructureID = vSharedInfoObject.currentStructureID;

						vSharedInfoObject.currentStructureID = pStructureID;
						if(gIsConstructorCalled_structures[pStructureID])
							{halt('SECOND CALL TO CONSTRUCTOR');}
						gIsConstructorCalled_structures[pStructureID] = true;
						if(gCompiledStructures[pStructureID].INHERITS && 
								gCompiledStructures[pStructureID].INHERITS.length > 0)
						{
							for(var tI = 0; tI < gCompiledStructures[pStructureID].INHERITS.length; tI++)
							{
								if(gIsConstructorCalled_structures[gCompiledStructures[pStructureID].INHERITS[tI]])
									{halt('UNKNOWN CONSTRUCTION ERROR');}
							}

							pFunction.apply(vSharedInfoObject.CRX_PRIVATE_SEGMENTS[pStructureID], arguments);

							for(var tI = 0; tI < gCompiledStructures[pStructureID].INHERITS.length; tI++)
							{
								if(!gCompiledStructures[gCompiledStructures[pStructureID].INHERITS[tI]].PUBLIC_CONSTRUCT)
									{continue;}

								if(!gIsConstructorCalled_structures[gCompiledStructures[pStructureID].INHERITS[tI]])
								{
									gCompiledStructures[gCompiledStructures[pStructureID].INHERITS[tI]].PUBLIC_CONSTRUCT.apply(
											vSharedInfoObject.CRX_PRIVATE_SEGMENTS[gCompiledStructures[pStructureID].INHERITS[tI]]);
								}
								if(!gIsConstructorCalled_structures[gCompiledStructures[pStructureID].INHERITS[tI]])
									{halt('UNKNOWN CONSTRUCTION ERROR');}
								gIsConstructorCalled_structures[gCompiledStructures[pStructureID].INHERITS[tI]] = false;

								//delete(pPublicThis.PARENT(gStructureDefinitions[gCompiledStructures[pStructureID].INHERITS[tI]]).CONSTRUCT);
							}
						}
						else
							{pFunction.apply(vSharedInfoObject.CRX_PRIVATE_SEGMENTS[pStructureID], arguments);}

						vSharedInfoObject.currentStructureID = vStructureID;
					};
				})(pStructureID, pFunction);
			}
			else
			{
				gStructureFTables[pStructureID]["pub"]["CONSTRUCT"] = (function(pStructureID)
				{
					return function(){
						if(gIsHalted){return;}

						var vSharedInfoObject = getStructureInfoObject(this);
						var vStructureID = vSharedInfoObject.currentStructureID;

						vSharedInfoObject.currentStructureID = pStructureID;
						if(gIsConstructorCalled_structures[pStructureID])
							{halt('SECOND CALL TO CONSTRUCTOR');}
						gIsConstructorCalled_structures[pStructureID] = true;

						for(var tI = 0; tI < gCompiledStructures[pStructureID].INHERITS.length; tI++)
						{
							if(!gCompiledStructures[gCompiledStructures[pStructureID].INHERITS[tI]].PUBLIC_CONSTRUCT)
								{continue;}

							if(gIsConstructorCalled_structures[gCompiledStructures[pStructureID].INHERITS[tI]])
								{halt('UNKNOWN CONSTRUCTION ERROR');}

							gCompiledStructures[gCompiledStructures[pStructureID].INHERITS[tI]].PUBLIC_CONSTRUCT.apply(
									vSharedInfoObject.CRX_PRIVATE_SEGMENTS[gCompiledStructures[pStructureID].INHERITS[tI]],
									arguments);

							if(!gIsConstructorCalled_structures[gCompiledStructures[pStructureID].INHERITS[tI]])
								{halt('UNKNOWN CONSTRUCTION ERROR');}

							gIsConstructorCalled_structures[gCompiledStructures[pStructureID].INHERITS[tI]] = false;
						}

						vSharedInfoObject.currentStructureID = vStructureID;
					}
				})(pStructureID);
			}

			return gStructureFTables[pStructureID]["pub"]["CONSTRUCT"];
		}
	}
	function ftable_structure_this_call(pStructureID, pFTableIndex, pKey, pFunction, pIsSharedAndStructureHasNoPrivateSegment)
	{
		if(gStructureFTables[pStructureID] && gStructureFTables[pStructureID][pFTableIndex] &&
				gStructureFTables[pStructureID][pFTableIndex][pKey])
			{return gStructureFTables[pStructureID][pFTableIndex][pKey];}
		else
		{
			if(!gStructureFTables[pStructureID])
				{gStructureFTables[pStructureID] = {};}
			if(!gStructureFTables[pStructureID][pFTableIndex])
				{gStructureFTables[pStructureID][pFTableIndex] = {};}

			if(pIsSharedAndStructureHasNoPrivateSegment)
			{
				gStructureFTables[pStructureID][pFTableIndex][pKey] = (function(pStructureID, pFunction)
				{
					return function(){
						if(gIsHalted){return;}

						var vSharedInfoObject = getStructureInfoObject(this);
						var vStructureID = vSharedInfoObject.currentStructureID;
						var vReturn = undefined;

						vSharedInfoObject.CRX_STRUCTURE_ID = pStructureID;
						vReturn = pFunction.apply(getStructureInfoObject(this).CRX_PRIVATE_SEGMENTS[pStructureID],
									arguments);
						vSharedInfoObject.CRX_STRUCTURE_ID = vStructureID;

						return vReturn;
					}
				})(pStructureID, pFunction);
			}
			else
			{
				gStructureFTables[pStructureID][pFTableIndex][pKey] = (function(pStructureID, pFunction)
				{
					return function(){
						if(gIsHalted){return;}

						return pFunction.apply(getStructureInfoObject(this).CRX_PRIVATE_SEGMENTS[pStructureID],
									arguments);
					}
				})(pStructureID, pFunction);
			}
		}

		return gStructureFTables[pStructureID][pFTableIndex][pKey];
	}

	function prepareStructure(pStructureDefinition)
	{
		gIsStarted = true;
		inspectStructureDefinition(pStructureDefinition);
	}

	function getStructureInfoObject(pObject)
	{
		var vReturn = null;

		pObject.CRX_STRUCTURE_INFO();
		vReturn = gSecureClassData_return;
		gSecureClassData_return = null;

		if(vReturn === null)
			{halt('SECURITY ERROR, ACCESS VIOLATION');}

		return vReturn;
	}
	function getObjectCurrentStructureID(pObject, pClassInfoObject)
	{
		if(pObject.CRX_STRUCTURE_ID_PV)
		{
			if(pClassInfoObject.CRX_PRIVATE_SEGMENTS[pObject.CRX_STRUCTURE_ID_PV] !== pObject)
				{halt("SECURITY VIOLATION");}
			return pObject.CRX_STRUCTURE_ID_PV;
		}
		else
		{
			if(pClassInfoObject.CRX_PRIVATE_SEGMENTS[pClassInfoObject.currentStructureID] !== pObject)
				{return (pObject.CRX_STRUCTURE_ID || null);}
			return pClassInfoObject.currentStructureID;
		}
	}
	function inspectStructureDefinition(pStructureDefinition)
	{
		if(gCheckedStructureDefinitions[pStructureDefinition.CRX_STRUCTURE_ID])
			{return pStructureDefinition;}

		var vErrors = [];
		var vWarnings = [];
		var vParsingData = {};

		vParsingData['originalStructureID'] = pStructureDefinition.CRX_STRUCTURE_ID;
		vParsingData['extensionChain'] = {};
		vParsingData['shared'] = {};
		vParsingData['SHARED_PUBLIC_VARS'] = {};
		vParsingData['SHARED_PUBLIC_FUNCTIONS'] = {};
		vParsingData['SHARED_PRIVATE_VARS'] = {};
		vParsingData['SHARED_PRIVATE_FUNCTIONS'] = {};

		inspectClassDefinition_processVerboseDefinition(pStructureDefinition, true);
		inspectStructureDefinition_processDefinition(gStructureDefinitions[pStructureDefinition.CRX_STRUCTURE_ID], vErrors, vWarnings, vParsingData);

		for(var tI = 0; tI < vWarnings.length; tI++)
			{gFunc_log("WARNING: " + vWarnings[tI], 1);}
		for(var tI = 0; tI < vErrors.length; tI++)
			{gFunc_log("FATAL ERROR: " + vErrors[tI], 0);}

		gCheckedStructureDefinitions[pStructureDefinition.CRX_STRUCTURE_ID] = true;

		if(vErrors.length > 0)
			{halt("DEFINITION ERROR");}
	}
	function inspectStructureDefinition_processDefinition(pStructure, pErrors, pWarnings, pParsingData)
	{
		if(gStructureParsingData.hasOwnProperty(pStructure.CRX_STRUCTURE_ID))
		{
			for(var tKey in gStructureParsingData[pStructure.CRX_STRUCTURE_ID].extensionChain)
			{
				if(!gStructureParsingData[pStructure.CRX_STRUCTURE_ID].extensionChain.hasOwnProperty(tKey))
					{continue;}

				if(pParsingData['extensionChain'][tKey] || (tKey === pStructure.CRX_STRUCTURE_ID))
				{
					halt('CIRCULAR INHERITANCE DETECTED ON STRUCTURE "' + 
							getStructureNameOrID(gStructureDefinitions[pParsingData.originalStructureID]) + '" THAT IS DUE TO INHERITING STRUCTURE "' + 
							getStructureNameOrID(gStructureDefinitions[tKey]) + '"');
				}
				pParsingData['extensionChain'][tKey] = true;
			}

			mergeToObject(pParsingData.shared, gStructureParsingData[pStructure.CRX_STRUCTURE_ID].shared);
			mergeToObject(pParsingData.SHARED_PUBLIC_VARS, gStructureParsingData[pStructure.CRX_STRUCTURE_ID].SHARED_PUBLIC_VARS);
			mergeToObject(pParsingData.SHARED_PUBLIC_FUNCTIONS, gStructureParsingData[pStructure.CRX_STRUCTURE_ID].SHARED_PUBLIC_FUNCTIONS);
			mergeToObject(pParsingData.SHARED_PRIVATE_VARS, gStructureParsingData[pStructure.CRX_STRUCTURE_ID].SHARED_PRIVATE_VARS);
			mergeToObject(pParsingData.SHARED_PRIVATE_FUNCTIONS, gStructureParsingData[pStructure.CRX_STRUCTURE_ID].SHARED_PRIVATE_FUNCTIONS);

			return;
		}

		if(pStructure.hasOwnProperty("INHERITS"))
		{
			if(getType(pStructure["INHERITS"]) !== "array")
			{
				pErrors.push("'INHERITS' DEFINITION FOR STRUCTURE '" + getStructureNameOrID(pStructure) +
						"' IS NOT AN ARRAY");
			}
			else
			{
				for(var tI = 0; tI < pStructure["INHERITS"].length; tI++)
				{
					var tStructure = getStructureDefinition(pStructure["INHERITS"][tI]);

					if(tStructure === null)
					{
						halt('MISSING DEFINITION FOR THE STRUCTURE "' + pStructure["INHERITS"][tI] + 
								'" THAT IS EXTENED BY STRUCTURE "' + getStructureNameOrID(pStructure) + '"');
					}
					if(pParsingData['extensionChain'].hasOwnProperty(tStructure.CRX_STRUCTURE_ID) ||
							(tStructure.CRX_STRUCTURE_ID === pStructure.CRX_STRUCTURE_ID))
					{
						halt('CIRCULAR INHERITANCE DETECTED ON STRUCTURE "' + 
							getStructureNameOrID(gStructureDefinitions[pParsingData.originalStructureID]) + '" THAT IS DUE TO INHERITING STRUCTURE "' + 
							getStructureNameOrID(pStructure) + '"')
					}
					pParsingData['extensionChain'][tStructure.CRX_STRUCTURE_ID] = true;

					inspectClassDefinition_processVerboseDefinition(tStructure, true);
					inspectStructureDefinition_processDefinition(gStructureDefinitions[tStructure.CRX_STRUCTURE_ID], pErrors, pWarnings, pParsingData);
				}
			}
		}

		parseStructure(gStructureDefinitions[pStructure.CRX_STRUCTURE_ID], pErrors, pWarnings, pParsingData);

		gStructureParsingData[pStructure.CRX_STRUCTURE_ID] = {};
		gStructureParsingData[pStructure.CRX_STRUCTURE_ID]['extensionChain'] = {};
		gStructureParsingData[pStructure.CRX_STRUCTURE_ID]['shared'] = {};
		gStructureParsingData[pStructure.CRX_STRUCTURE_ID]['SHARED_PUBLIC_VARS'] = {};
		gStructureParsingData[pStructure.CRX_STRUCTURE_ID]['SHARED_PUBLIC_FUNCTIONS'] = {};
		gStructureParsingData[pStructure.CRX_STRUCTURE_ID]['SHARED_PRIVATE_VARS'] = {};
		gStructureParsingData[pStructure.CRX_STRUCTURE_ID]['SHARED_PRIVATE_FUNCTIONS'] = {};
		mergeToObject(gStructureParsingData[pStructure.CRX_STRUCTURE_ID].extensionChain, pParsingData.extensionChain);
		mergeToObject(gStructureParsingData[pStructure.CRX_STRUCTURE_ID].shared, pParsingData.shared);
		mergeToObject(gStructureParsingData[pStructure.CRX_STRUCTURE_ID].SHARED_PUBLIC_VARS, pParsingData.SHARED_PUBLIC_VARS);
		mergeToObject(gStructureParsingData[pStructure.CRX_STRUCTURE_ID].SHARED_PUBLIC_FUNCTIONS, pParsingData.SHARED_PUBLIC_FUNCTIONS);
		mergeToObject(gStructureParsingData[pStructure.CRX_STRUCTURE_ID].SHARED_PRIVATE_VARS, pParsingData.SHARED_PRIVATE_VARS);
		mergeToObject(gStructureParsingData[pStructure.CRX_STRUCTURE_ID].SHARED_PRIVATE_FUNCTIONS, pParsingData.SHARED_PRIVATE_FUNCTIONS);
	}
	function parseStructure(pStructure, pErrors, pWarnings, pParsingData)
	{
		var vStructureNameOrID = getStructureNameOrID(pStructure);
		var vMembers = {};

		for(var tKey in pStructure)
		{
			if(!pStructure.hasOwnProperty(tKey))
				{continue;}

			if((tKey === "INHERITS") || (tKey === "") || (tKey === "CRX_DEFINITION") ||
					(tKey === "CRX_STRUCTURE_ID") || (tKey === "CRX_STRUCTURE_NAME"))
				{}
			else if(tKey === "SHARED")
			{
				for(var tKey2 in pStructure["SHARED"])
				{
					if(!pStructure["SHARED"].hasOwnProperty(tKey2))
						{continue;}

					if((tKey2 === "PUBLIC") || (tKey2 === "PRIVATE"))
					{
						parseStructure_scope(vStructureNameOrID, pErrors, "SHARED " + tKey2, "SHARED_" + tKey2, pStructure["SHARED"][tKey2], 
								vMembers, pParsingData);
					}
					else
						{pErrors.push('UNRECOGINZED TOKEN "SHARED ' + tKey2 + '" IN STRUCTURE "' + vStructureNameOrID + '"');}
				}
			}
			else if((tKey === "PRIVATE") || (tKey === "PUBLIC"))
				{parseStructure_scope(vStructureNameOrID, pErrors, tKey, tKey, pStructure[tKey], vMembers, pParsingData);}
			else
				{pErrors.push('UNRECOGINZED TOKEN "' + tKey + '" IN STRUCTURE "' + vStructureNameOrID + '"');}
		}

		if(pErrors.length === 0)
			{compileStrcture(pStructure);}
	}
	function parseStructure_scope(pStructureNameOrID, pErrors, pScope, pScopeKey, pStructureStructure, pMembers, pParsingData)
	{
		var vIsPublic = (pScope === "PUBLIC");

		for(var tKey in pStructureStructure)
		{
			if(!pStructureStructure.hasOwnProperty(tKey))
				{continue;}

			if((tKey === "CONSTRUCT") && vIsPublic)
			{
				isInvalidFunction(pErrors, pStructureNameOrID, "PUBLIC", tKey,
							pStructureStructure[tKey], false);
			}
			else if((tKey === "VARS") && !vIsPublic)
			{
				parseStructure_vars(pStructureNameOrID, pErrors, pScope + ' VARS', pScopeKey + '_VARS', 
						pStructureStructure['VARS'], pMembers, pParsingData);
			}
			else if((tKey === "FUNCTIONS") && !vIsPublic)
			{
				parseStructure_functions(pStructureNameOrID, pErrors, pScope + ' FUNCTIONS', pScopeKey + '_FUNCTIONS',
						pStructureStructure['FUNCTIONS'], pMembers, pParsingData);
			}
			else
				{pErrors.push('"' + pScope + ' ' + tKey + '" IS NOT ALLOWED. FOUND IN CLASS "' + pStructureNameOrID + '"');}
		}
	}
	function parseStructure_vars(pStructureNameOrID, pErrors, pScope, pScopeKey, pStructureStructure, pMembers, pParsingData)
	{
		if(!gAreSettersAndGettersSupported && (pScope.indexOf("SHARED") > -1))
			{pErrors.push(pStructureNameOrID + "::" + "VARS =>" + '"' + pScope + " CAN NOT BE SUPPORTED ON THIS BROWSER");}
		else
		{
			for(var tKey in pStructureStructure)
			{
				if(!pStructureStructure.hasOwnProperty(tKey) ||
						isIllegalClassMemberName(pErrors, pStructureNameOrID, pScope, pScopeKey, tKey, true))
					{continue;}

				checkStructureMember(pErrors, pStructureNameOrID, pScope, pScopeKey, tKey, pMembers, pParsingData);
			}
		}
	}
	function parseStructure_functions(pStructureNameOrID, pErrors, pScope, pScopeKey, pStructureStructure, pMembers, pParsingData)
	{
		for(var tKey in pStructureStructure)
		{
			if(!pStructureStructure.hasOwnProperty(tKey) ||
					isIllegalClassMemberName(pErrors, pStructureNameOrID, pScope, tKey, true) ||
					isInvalidFunction(pErrors, pStructureNameOrID, pScope, tKey,
							pStructureStructure[tKey], false))
				{continue;}

			checkStructureMember(pErrors, pStructureNameOrID, pScope, pScopeKey, tKey, pMembers, pParsingData);
		}
	}
	function checkStructureMember(pErrors, pStructureNameOrID, pScope, pScopeKey, pKey, pMembers, pParsingData)
	{
		var vIsShared = (pScope.indexOf("SHARED") > -1);

		if(pMembers.hasOwnProperty(pKey))
			{pErrors.push('DUPLICATE MEMBER "' + pKey + '" FOUND IN STRUCTURE "' + pStructureNameOrID + '"');}
		else if(pParsingData['shared'].hasOwnProperty(pKey))
		{
			if(!pParsingData[pScopeKey] || !pParsingData[pScopeKey].hasOwnProperty(pKey)) // !pParsingData[pScopeKey] means pScopeKey = PRIVATE_VARS OR PRIVATE_FUNCTIONS
			{
				var tMessage = 'MEMBER "' + pKey + '" FOUND IN STRUCTURE "' + pStructureNameOrID + ' IS ALREADY SHARED AND MUST BE ' +
						'DECLARED WITH THE SAME DECLARATION, "';

				if(pParsingData['SHARED_PUBLIC_VARS'].hasOwnProperty(pKey))
					{tMessage += "SHARED PUBLIC (VAR)";}
				else if(pParsingData['SHARED_PUBLIC_FUNCTIONS'])
					{tMessage += "SHARED PUBLIC (FUNCTION)";}
				else if(pParsingData['SHARED_PRIVATE_VARS'])
					{tMessage += "SHARED PRIVATE (VAR)";}
				else if(pParsingData['SHARED_PRIVATE_FUNCTIONS'])
					{tMessage += "SHARED PRIVATE (FUNCTION)";}

				tMessage += '"';

				pErrors.push(tMessage);
			}
		}

		pMembers[pKey] = true;

		if(vIsShared)
		{
			pParsingData['shared'][pKey] = true;
			pParsingData[pScopeKey][pKey] = true;
		}
	}
	function compileStrcture(pStructure)
	{
		if(gCompiledStructures[pStructure.CRX_STRUCTURE_ID])
			{return;}
		
		var vCompiledStructue = 
		{
			INHERITS: null,
			SHARED_LIST: [],
			SHARED: null,
			PUBLIC: null,
			PRIVATE: null,
			PRIVATES: []
		};
		var vStructureMemberScopes = {};
		var vStructureMemberTypes = {};
		var vPRIVATES_index = 0;
		var vHasPrivate = (pStructure.hasOwnProperty("PRIVATE") && ((pStructure["PRIVATE"].hasOwnProperty("VARS") &&
				(pStructure["PRIVATE"]["VARS"].length > 0)) || (pStructure["PRIVATE"].hasOwnProperty("FUNCTIONS") &&
				(pStructure["PRIVATE"]["FUNCTIONS"].length > 0))));
		var vAllSharedPublicVars = {};
		var vAllSharedPublicFunctions = {};
		var vAllSharedPrivateVars = {};
		var vAllSharedPrivateFunctions = {};
		var tKey = null;

		gStructureHasOwnIndex[pStructure.CRX_STRUCTURE_ID] = {};

		vCompiledStructue['CRX_STRUCTURE_ID'] = pStructure.CRX_STRUCTURE_ID;
		if(pStructure.hasOwnProperty("INHERITS"))
		{
			var tStructureID = null;
			var tSharedPublicVars = 

			vCompiledStructue.INHERITS = [];

			for(var tI = 0; tI < pStructure['INHERITS'].length; tI++)
			{
				tStructureID = getStructureID(pStructure['INHERITS'][tI]);

				vCompiledStructue.INHERITS.push(tStructureID);
				vCompiledStructue.SHARED_LIST.push(tStructureID);

				for(var tI2 = 0; tI2 < gCompiledStructures[tStructureID].SHARED_LIST.length; tI2++)
				{
					vCompiledStructue.SHARED_LIST.push(gCompiledStructures[tStructureID].SHARED_LIST[tI2]);

					if(gCompiledStructures[gCompiledStructures[tStructureID].SHARED_LIST[tI2]].SHARED)
					{
						vCompiledStructue.SHARED = true;

						if(gCompiledStructures[gCompiledStructures[tStructureID].SHARED_LIST[tI2]].SHARED_PUBLIC)
							{vCompiledStructue.SHARED_PUBLIC = true;}
						if(gCompiledStructures[gCompiledStructures[tStructureID].SHARED_LIST[tI2]].SHARED_PRIVATE)
							{vCompiledStructue.SHARED_PRIVATE = true;}
					}
				}

				for(var tI2 = 0; tI2 < gCompiledStructures[tStructureID].PRIVATES.length; tI2++)
				{
					vCompiledStructue.PRIVATES[vPRIVATES_index] = gCompiledStructures[tStructureID].PRIVATES[tI2];
					vPRIVATES_index++
				}

				if(gCompiledStructures[tStructureID].SHARED)
				{
					for(var tI2 = 0; tI2 < gCompiledStructures[tStructureID].SHARED_ALL_PUBLIC_VARS.length; tI2++)
					{
						vAllSharedPublicVars[gCompiledStructures[tStructureID].SHARED_ALL_PUBLIC_VARS[tI2][0]] = 
								gCompiledStructures[tStructureID].SHARED_ALL_PUBLIC_VARS[tI2];
					}
					for(var tI2 = 0; tI2 < gCompiledStructures[tStructureID].SHARED_ALL_PUBLIC_FUNCTIONS.length; tI2++)
					{
						vAllSharedPublicFunctions[gCompiledStructures[tStructureID].SHARED_ALL_PUBLIC_FUNCTIONS[tI2][0]] = 
								gCompiledStructures[tStructureID].SHARED_ALL_PUBLIC_FUNCTIONS[tI2];
					}
					for(var tI2 = 0; tI2 < gCompiledStructures[tStructureID].SHARED_ALL_PRIVATE_VARS.length; tI2++)
					{
						vAllSharedPrivateVars[gCompiledStructures[tStructureID].SHARED_ALL_PRIVATE_VARS[tI2][0]] = 
								gCompiledStructures[tStructureID].SHARED_ALL_PRIVATE_VARS[tI2];
					}
					for(var tI2 = 0; tI2 < gCompiledStructures[tStructureID].SHARED_ALL_PRIVATE_FUNCTIONS.length; tI2++)
					{
						vAllSharedPrivateFunctions[gCompiledStructures[tStructureID].SHARED_ALL_PRIVATE_FUNCTIONS[tI2][0]] = 
								gCompiledStructures[tStructureID].SHARED_ALL_PRIVATE_FUNCTIONS[tI2];
					}
				}
			}
		}

		if(vCompiledStructue.SHARED || pStructure.hasOwnProperty("SHARED"))
		{
			vCompiledStructue.SHARED_PUBLIC_VARS = [];
			vCompiledStructue.SHARED_PUBLIC_FUNCTIONS = [];
			vCompiledStructue.SHARED_ALL_PUBLIC_VARS = [];
			vCompiledStructue.SHARED_ALL_PUBLIC_FUNCTIONS = [];

			vCompiledStructue.SHARED_PRIVATE_VARS = [];
			vCompiledStructue.SHARED_PRIVATE_FUNCTIONS = [];
			vCompiledStructue.SHARED_ALL_PRIVATE_VARS = [];
			vCompiledStructue.SHARED_ALL_PRIVATE_FUNCTIONS = [];
		}

		if(pStructure.hasOwnProperty("SHARED"))
		{
			if(pStructure['SHARED'].hasOwnProperty('PUBLIC'))
			{
				vCompiledStructue.SHARED_PUBLIC = true;

				if(pStructure["SHARED"]["PUBLIC"].hasOwnProperty("VARS"))
				{
					for(tKey in pStructure["SHARED"]["PUBLIC"]["VARS"])
					{
						if(pStructure["SHARED"]["PUBLIC"]["VARS"].hasOwnProperty(tKey))
						{
							vCompiledStructue.SHARED_PUBLIC_VARS.push([tKey, crxOop_var(pStructure["SHARED"]["PUBLIC"]["VARS"][tKey]),
									(function(pStructureID, pKey)
							{
								return function()
								{
									var vStructureInfoObject = getStructureInfoObject(this);

									if(vStructureInfoObject.CRX_PRIVATE_SEGMENTS[pStructureID])
										{return vStructureInfoObject.CRX_SHARED_SEGMENTS_DATA[pKey];}
								};
							})(pStructure.CRX_STRUCTURE_ID, tKey), 
							(function(pStructureID, pKey)
							{
								return function(pValue)
								{
									var vStructureInfoObject = getStructureInfoObject(this);

									if(vStructureInfoObject.CRX_PRIVATE_SEGMENTS[pStructureID])
										{vStructureInfoObject.CRX_SHARED_SEGMENTS_DATA[pKey] = pValue;}
								};
							})(pStructure.CRX_STRUCTURE_ID, tKey)]);
							vAllSharedPublicVars[tKey] = vCompiledStructue.SHARED_PUBLIC_VARS[vCompiledStructue.SHARED_PUBLIC_VARS.length - 1];
							vStructureMemberScopes[tKey] = SCOPE_SHARED_PUBLIC;
							vStructureMemberTypes[tKey] = MEMBER_TYPE_VAR;
						}
					}
				}
				if(pStructure["SHARED"]["PUBLIC"].hasOwnProperty("FUNCTIONS"))
				{
					for(tKey in pStructure["SHARED"]["PUBLIC"]["FUNCTIONS"])
					{
						if(pStructure["SHARED"]["PUBLIC"]["FUNCTIONS"].hasOwnProperty(tKey))
						{
							vCompiledStructue.SHARED_PUBLIC_FUNCTIONS.push([tKey, ftable_structure_this_call(pStructure.CRX_STRUCTURE_ID, 
									"shpu", tKey, pStructure["SHARED"]["PUBLIC"]["FUNCTIONS"][tKey], !vHasPrivate)]);
							vAllSharedPublicFunctions[tKey] = vCompiledStructue.SHARED_PUBLIC_FUNCTIONS[
									vCompiledStructue.SHARED_PUBLIC_FUNCTIONS.length - 1];
							vStructureMemberScopes[tKey] = SCOPE_SHARED_PUBLIC;
							vStructureMemberTypes[tKey] = MEMBER_TYPE_FUNCTION;
						}
					}
				}
				if((vCompiledStructue.SHARED_PUBLIC_VARS.length > 0) || (vCompiledStructue.SHARED_PUBLIC_FUNCTIONS.length > 0))
					{vCompiledStructue.SHARED_PUBLIC = true;}
			}

			if(pStructure['SHARED'].hasOwnProperty('PRIVATE'))
			{
				vCompiledStructue.SHARED_PRIVATE = true;

				if(pStructure["SHARED"]["PRIVATE"].hasOwnProperty("VARS"))
				{
					for(tKey in pStructure["SHARED"]["PRIVATE"]["VARS"])
					{
						if(pStructure["SHARED"]["PRIVATE"]["VARS"].hasOwnProperty(tKey))
						{
							vCompiledStructue.SHARED_PRIVATE_VARS.push([tKey, crxOop_var(pStructure["SHARED"]["PRIVATE"]["VARS"][tKey]),
									(function(pStructureID, pKey)
							{
								return function()
								{
									var vStructureInfoObject = getStructureInfoObject(this);

									if(vStructureInfoObject.CRX_PRIVATE_SEGMENTS[pStructureID] &&
											(vStructureInfoObject.CRX_PRIVATE_SEGMENTS[getObjectCurrentStructureID(this, vStructureInfoObject)] ===
											this))
										{return vStructureInfoObject.CRX_SHARED_SEGMENTS_DATA[pKey];}
								};
							})(pStructure.CRX_STRUCTURE_ID, tKey), 
							(function(pStructureID, pKey)
							{
								return function(pValue)
								{
									var vStructureInfoObject = getStructureInfoObject(this);

									if(vStructureInfoObject.CRX_PRIVATE_SEGMENTS[pStructureID] &&
											(vStructureInfoObject.CRX_PRIVATE_SEGMENTS[getObjectCurrentStructureID(this, vStructureInfoObject)] ===
											this))
										{vStructureInfoObject.CRX_SHARED_SEGMENTS_DATA[pKey] = pValue;}
								};
							})(pStructure.CRX_STRUCTURE_ID, tKey)]);
							vAllSharedPrivateVars[tKey] = vCompiledStructue.SHARED_PRIVATE_VARS[vCompiledStructue.SHARED_PRIVATE_VARS.length - 1];
							vStructureMemberScopes[tKey] = SCOPE_SHARED_PRIVATE;
							vStructureMemberTypes[tKey] = MEMBER_TYPE_VAR;
						}
					}
				}
				if(pStructure["SHARED"]["PRIVATE"].hasOwnProperty("FUNCTIONS"))
				{
					for(tKey in pStructure["SHARED"]["PRIVATE"]["FUNCTIONS"])
					{
						if(pStructure["SHARED"]["PRIVATE"]["FUNCTIONS"].hasOwnProperty(tKey))
						{
							vCompiledStructue.SHARED_PRIVATE_FUNCTIONS.push([tKey, ftable_structure_this_call(pStructure.CRX_STRUCTURE_ID, 
									"shpr", tKey, pStructure["SHARED"]["PRIVATE"]["FUNCTIONS"][tKey], !vHasPrivate)]);
							vAllSharedPrivateFunctions[tKey] = vCompiledStructue.SHARED_PRIVATE_FUNCTIONS[
									vCompiledStructue.SHARED_PRIVATE_FUNCTIONS.length - 1];
							vStructureMemberScopes[tKey] = SCOPE_SHARED_PRIVATE;
							vStructureMemberTypes[tKey] = MEMBER_TYPE_FUNCTION;
						}
					}
				}

				if((vCompiledStructue.SHARED_PRIVATE_VARS.length > 0) || (vCompiledStructue.SHARED_PRIVATE_FUNCTIONS.length > 0))
					{vCompiledStructue.SHARED_PRIVATE = true;}
			}

			if(vCompiledStructue.SHARED_PUBLIC || vCompiledStructue.SHARED_PRIVATE)
				{vCompiledStructue.SHARED = true;}
		}
		if(pStructure.hasOwnProperty("PRIVATE"))
		{
			vCompiledStructue.PRIVATE_VARS = [];
			vCompiledStructue.PRIVATE_FUNCTIONS = [];

			if(pStructure["PRIVATE"].hasOwnProperty("VARS"))
			{
				for(tKey in pStructure["PRIVATE"]["VARS"])
				{
					if(pStructure["PRIVATE"]["VARS"].hasOwnProperty(tKey))
					{
						vCompiledStructue.PRIVATE_VARS.push([tKey, crxOop_var(pStructure["PRIVATE"]["VARS"][tKey])]);
						vStructureMemberScopes[tKey] = SCOPE_PRIVATE;
						vStructureMemberTypes[tKey] = MEMBER_TYPE_VAR;
						gStructureHasOwnIndex[pStructure.CRX_STRUCTURE_ID][tKey] = HASOWN_TYPE_VAR | HASOWN_SCOPE_PRIVATE;
					}
				}
			}
			if(pStructure["PRIVATE"].hasOwnProperty("FUNCTIONS"))
			{
				for(tKey in pStructure["PRIVATE"]["FUNCTIONS"])
				{
					if(pStructure["PRIVATE"]["FUNCTIONS"].hasOwnProperty(tKey))
					{
						vCompiledStructue.PRIVATE_FUNCTIONS.push([tKey, ftable_structure_this_call(pStructure.CRX_STRUCTURE_ID, 
									"pr", tKey, pStructure["PRIVATE"]["FUNCTIONS"][tKey], false)]);
						vStructureMemberScopes[tKey] = SCOPE_PRIVATE;
						vStructureMemberTypes[tKey] = MEMBER_TYPE_FUNCTION;
						gStructureHasOwnIndex[pStructure.CRX_STRUCTURE_ID][tKey] = HASOWN_TYPE_FUNCTION | HASOWN_SCOPE_PRIVATE;
					}
				}
			}

			if((vCompiledStructue.PRIVATE_VARS.length > 0) || (vCompiledStructue.PRIVATE_FUNCTIONS.length > 0))
			{
				vCompiledStructue.PRIVATE = true;

				vCompiledStructue.PRIVATES[vPRIVATES_index] = pStructure.CRX_STRUCTURE_ID;
				vPRIVATES_index++;
			}
		}
		if(pStructure.hasOwnProperty("PUBLIC") && pStructure["PUBLIC"].hasOwnProperty("CONSTRUCT"))
		{
			vCompiledStructue.PUBLIC_CONSTRUCT = this_call__structureConstructor(pStructure.CRX_STRUCTURE_ID, 
					pStructure["PUBLIC"]["CONSTRUCT"]);
			vCompiledStructue.PUBLIC = true;
		}
		else if(vCompiledStructue.INHERITS && (vCompiledStructue.INHERITS.length > 0))
		{
			for(var tI = 0; tI < vCompiledStructue.INHERITS.length; tI++)
			{
				if(gCompiledStructures[vCompiledStructue.INHERITS[tI]].PUBLIC &&
						gCompiledStructures[vCompiledStructue.INHERITS[tI]].PUBLIC_CONSTRUCT)
				{
					vCompiledStructue.PUBLIC_CONSTRUCT = this_call__structureConstructor(pStructure.CRX_STRUCTURE_ID);
					vCompiledStructue.PUBLIC = true;
				}
			}
		}

		if(vCompiledStructue.SHARED)
		{
			for(tKey in vAllSharedPublicVars)
			{
				if(vAllSharedPublicVars.hasOwnProperty(tKey))
				{
					vCompiledStructue.SHARED_ALL_PUBLIC_VARS.push(vAllSharedPublicVars[tKey]);
					gStructureHasOwnIndex[pStructure.CRX_STRUCTURE_ID][tKey] = HASOWN_TYPE_VAR | HASOWN_SCOPE_SHARED_PUBLIC;
				}
			}
			for(tKey in vAllSharedPublicFunctions)
			{
				if(vAllSharedPublicFunctions.hasOwnProperty(tKey))
				{
					vCompiledStructue.SHARED_ALL_PUBLIC_FUNCTIONS.push(vAllSharedPublicFunctions[tKey]);
					gStructureHasOwnIndex[pStructure.CRX_STRUCTURE_ID][tKey] = HASOWN_TYPE_FUNCTION | HASOWN_SCOPE_SHARED_PUBLIC;
				}
			}
			for(tKey in vAllSharedPrivateVars)
			{
				if(vAllSharedPrivateVars.hasOwnProperty(tKey))
				{
					vCompiledStructue.SHARED_ALL_PRIVATE_VARS.push(vAllSharedPrivateVars[tKey]);
					gStructureHasOwnIndex[pStructure.CRX_STRUCTURE_ID][tKey] = HASOWN_TYPE_VAR | HASOWN_SCOPE_SHARED_PRIVATE;
				}
			}
			for(tKey in vAllSharedPrivateFunctions)
			{
				if(vAllSharedPrivateFunctions.hasOwnProperty(tKey))
				{
					vCompiledStructue.SHARED_ALL_PRIVATE_FUNCTIONS.push(vAllSharedPrivateFunctions[tKey]);
					gStructureHasOwnIndex[pStructure.CRX_STRUCTURE_ID][tKey] = HASOWN_TYPE_FUNCTION | HASOWN_SCOPE_SHARED_PRIVATE;
				}
			}
		}

		vCompiledStructue.SHARED_LIST.push(pStructure.CRX_STRUCTURE_ID);

		gCompiledStructures[pStructure.CRX_STRUCTURE_ID] = vCompiledStructue;
		gStructureMemberScopes[pStructure.CRX_STRUCTURE_ID] = vStructureMemberScopes;
		gStructureMemberTypes[pStructure.CRX_STRUCTURE_ID] = vStructureMemberTypes;
	}
	function getStructurePrototype(pCompiledStructure)
	{
		if(gStructurePrototypes.hasOwnProperty(pCompiledStructure.CRX_STRUCTURE_ID))
			{return gStructurePrototypes[pCompiledStructure.CRX_STRUCTURE_ID];}

		var vPrototypeObject = {};

		if(pCompiledStructure.INHERITS)
		{
			for(var tI = 0; tI < pCompiledStructure.INHERITS.length; tI++)
			{
				mergeToObject(vPrototypeObject,
						getStructurePrototype(gCompiledStructures[pCompiledStructure.INHERITS[tI]]));
			}
		}

		if(pCompiledStructure.SHARED)
		{
			if(pCompiledStructure.SHARED_PUBLIC)
			{
				for(var tI = 0; tI < pCompiledStructure.SHARED_PUBLIC_FUNCTIONS.length; tI++)
				{
					vPrototypeObject[pCompiledStructure.SHARED_PUBLIC_FUNCTIONS[tI][0]] =
							pCompiledStructure.SHARED_PUBLIC_FUNCTIONS[tI][1];
				}
			}
		}

		vPrototypeObject.CRX_STRUCTURE_ID = pCompiledStructure.CRX_STRUCTURE_ID;
		vPrototypeObject.SR = _sr_structure;
		vPrototypeObject.HASOWN = _hasOwn;

		gFunc_freezeObject(vPrototypeObject);
		gStructurePrototypes[pCompiledStructure.CRX_STRUCTURE_ID] = vPrototypeObject;

		return gStructurePrototypes[pCompiledStructure.CRX_STRUCTURE_ID];
	}

	function _this_structure(pPrivateThis, pStructureID)
	{
		/*return function(pObject)
		{
			if(gIsHalted){return;}

			if(this === pPrivateThis)
				{return (getStructureInfoObject(pObject).CRX_PRIVATE_SEGMENTS[pStructureID] || null);}

			halt("SECURITY ERROR WHILE USING 'O'");
		}*/
		return _this_structure.func;
	}
	_this_structure.func = function(pObject)
	{
		if(gIsHalted){return;}

		if(this.CRX_STRUCTURE_ID_PV)
		{
			var tStructureInfoObject = getStructureInfoObject(this);
			
			if(tStructureInfoObject.CRX_PRIVATE_SEGMENTS[this.CRX_STRUCTURE_ID_PV] === this)
				{return (getStructureInfoObject(pObject).CRX_PRIVATE_SEGMENTS[this.CRX_STRUCTURE_ID_PV] || null);}
		}

		halt("SECURITY ERROR WHILE USING 'O'");
	};
	function _this_structure_shared(pObject)
	{
		if(gIsHalted){return;}

		var vStructureInfoObject = getStructureInfoObject(pObject);

		if(this === vStructureInfoObject.CRX_PRIVATE_SEGMENTS[vStructureInfoObject.currentStructureID])
			{return (getStructureInfoObject(pObject).CRX_PRIVATE_SEGMENTS[vStructureInfoObject.currentStructureID] || null);}

		halt("SECURITY ERROR WHILE USING 'O'");
	}
	function _sr_structure(pStructureDefinitionOrStructureName, pMemberName)
	{
		if(gIsHalted){return;}

		var vStructureID = null;
		var vObject = null;
		var vClassInfoObject_caller = null;
		var vStructureID_caller = null;

		if((pStructureDefinitionOrStructureName !== undefined) && (pStructureDefinitionOrStructureName !== null))
		{
			vClassInfoObject_caller = getStructureInfoObject(this);
			vStructureID = getStructureID(pStructureDefinitionOrStructureName);
			vObject = vClassInfoObject_caller.CRX_PRIVATE_SEGMENTS[vStructureID] || null;
		}

		if(!vStructureID)
			{halt('UNDECLARED STRUCTURE "??' + pStructureDefinitionOrStructureName + '??"', -1);}
		if(!vObject)
		{
			halt('CAN NOT RESOLVE MEMBER "' + pMemberName + '" ON STRUCTURE "' +
					getStructureNameOrID(gStructureDefinitions[vStructureID]) + '". INSTANCE NOT A SUPER SET OF STRUCTURE "' +
					getStructureNameOrID(gStructureDefinitions[vStructureID]) + '"', -1);
		}

		//vClassInfoObject_caller = getStructureInfoObject(this);

		vStructureID_caller = getObjectCurrentStructureID(this, vClassInfoObject_caller);

		if(gStructureMemberScopes[vStructureID][pMemberName] !== SCOPE_PRIVATE)
		{
			if(gStructureMemberScopes[vStructureID][pMemberName] === SCOPE_SHARED_PRIVATE)
			{
				if(this === vClassInfoObject_caller.CRX_PRIVATE_SEGMENTS[vStructureID_caller])
				{
					if(gStructureMemberTypes[vStructureID][pMemberName] === MEMBER_TYPE_VAR)
						{return undefined; /*this[pMemberName];*/}
					else
						{return gStructureFTables[vStructureID]["shpr"][pMemberName].apply(vObject, Array.prototype.slice.call(arguments, 2));}
				}
			}
			else if(gStructureMemberScopes[vStructureID][pMemberName] === SCOPE_SHARED_PUBLIC)
			{
				if(gStructureMemberTypes[vStructureID][pMemberName] === MEMBER_TYPE_VAR)
					{return undefined; /*this[pMemberName];*/}
				else
					{return gStructureFTables[vStructureID]["shpu"][pMemberName].apply(this, Array.prototype.slice.call(arguments, 2));}
			}
		}

		halt('ILLEGAL ACCESS TO, OR UNKNOWN, MEMBER "' + pMemberName + '" IN STRUCTURE "' +
				getStructureNameOrID(gStructureDefinitions[vStructureID]) + '"', -1);
	}
	
	function _structureConstruct(pStructureDefinitionOrStructureName)
	{
		var vSharedInfoObject = getStructureInfoObject(this);
		var vStructureID = vSharedInfoObject.currentStructureID;

		if(vStructureID)
		{
			var tStructureID = getStructureID(pStructureDefinitionOrStructureName);
			var tWasFound = false;

			if(tStructureID)
			{
				for(var tI = 0; tI < gCompiledStructures[vStructureID].INHERITS.length; tI++)
				{
					if(gCompiledStructures[vStructureID].INHERITS[tI] === tStructureID)
					{
						tWasFound = true;
						break;
					}
				}

				if(tWasFound)
				{
					return (function(pThis){
						return function(){gStructureFTables[tStructureID]['pub']['CONSTRUCT'].apply(pThis, arguments);};
					})(vSharedInfoObject.CRX_PRIVATE_SEGMENTS[tStructureID]);
				}
				else
				{
					halt('CALL TO "' + getStructureNameOrID(gStructureDefinitions[tStructureID]) + '::CONSTRUCT" IN "' +
							getStructureNameOrID(gStructureDefinitions[vStructureID]) + 
							'::CONSTRUCT" CAN NOT BE RESOLVED', -1);
				}
			}
			else
				{halt('UNREGISTERED STRUCTURE "' + pStructureDefinitionOrStructureName + '"', -1);}
		}
		else
			{halt('UNKNOWN ERROR IN CONSTRUCTOR CALL');}
	}

	function isStructureInheriting(pStructureDefinitionOrStructureName1, pStructureDefinitionOrStructureName2, pIsInclusiveCheck)
	{
		if(gIsHalted){return;}

		var vStructure1 = getStructureDefinition(pStructureDefinitionOrStructureName1);
		var vStructure2 = getStructureDefinition(pStructureDefinitionOrStructureName2);
		var vCompiledStructure = null;

		if(vStructure1 === null)
			{halt('UNDECLARED STRUCTURE "??' + pStructureDefinitionOrStructureName1 + '??"', -1);}
		else if(vStructure2 === null)
			{halt('UNDECLARED STRUCTURE "??' + pStructureDefinitionOrStructureName2 + '??"', -1);}
		prepareStructure(vStructure1);
		prepareStructure(vStructure2);
		
		vCompiledStructure = gCompiledStructures[vStructure1.CRX_STRUCTURE_ID];

		if(!pIsInclusiveCheck && (vCompiledStructure === gCompiledStructures[vStructure2.CRX_STRUCTURE_ID]))
			{return false;}
		else
		{
			for(var tI = 0; tI < vCompiledStructure.SHARED_LIST.length; tI++)
			{
				if(vCompiledStructure.SHARED_LIST[tI] === vStructure2.CRX_STRUCTURE_ID)
					{return true;}
			}
		}
		return false;
	}
	function isStructureRegistered(pStructureDefinitionOrStructureName1)
		{return (getStructureDefinition(pStructureDefinitionOrStructureName1, true) ? true : false);}

	function _hasOwn(pMember, pScope, pType, pIsExclusive)
	{
		pScope = (!pScope ? HASOWN_SCOPE_SHARED_PUBLIC : pScope);
		pType = (!pType ? HASOWN_TYPE_VAR : pType);

		var vClassInfoObject = getStructureInfoObject(this);
		var vCurrentStructureID = getObjectCurrentStructureID(this, vClassInfoObject);
		var vStructureID = (pIsExclusive ? vCurrentStructureID : this.CRX_STRUCTURE_ID);

		if(!isIllegalClassMemberName.illegalNames.hasOwnProperty(pMember))
		{
			if(gStructureHasOwnIndex[vStructureID].hasOwnProperty(pMember))
			{
				if(gStructureHasOwnIndex[vStructureID][pMember] & pScope)
				{
					if((gStructureHasOwnIndex[vStructureID][pMember] & HASOWN_SCOPE_SHARED_PUBLIC) ||
							(((gStructureHasOwnIndex[vStructureID][pMember] & HASOWN_SCOPE_SHARED_PRIVATE)  || 
									(gStructureHasOwnIndex[vStructureID][pMember] & HASOWN_SCOPE_PRIVATE)) &&
							(this === vClassInfoObject.CRX_PRIVATE_SEGMENTS[vCurrentStructureID])))
					{
						if(gStructureHasOwnIndex[vStructureID][pMember] & pType)
							{return true;}
					}
				}
			}
			else if(!pIsExclusive && (pType & HASOWN_TYPE_FOREIGN))
			{
				if(this === vClassInfoObject.CRX_SHARED_SEGMENT)
				{
					return (true && (pScope & HASOWN_SCOPE_SHARED_PUBLIC) && this.hasOwnProperty(pMember));
				}
				else if(this === vClassInfoObject.CRX_SHARED_PRIVATE_SEGMENT)
				{
					return (true && (((pScope & HASOWN_SCOPE_SHARED_PRIVATE) && this.hasOwnProperty(pMember)) || 
							((pScope & HASOWN_SCOPE_SHARED_PUBLIC) && vClassInfoObject.CRX_SHARED_SEGMENT.hasOwnProperty(pMember))));
				}
				else if(this === vClassInfoObject.CRX_PRIVATE_SEGMENTS[vCurrentStructureID])
				{
					return (true && (((pScope & HASOWN_SCOPE_PRIVATE) && this.hasOwnProperty(pMember)) || 
							((pScope & HASOWN_SCOPE_SHARED_PRIVATE) && vClassInfoObject.CRX_SHARED_PRIVATE_SEGMENT.hasOwnProperty(pMember)) || 
							((pScope & HASOWN_SCOPE_SHARED_PUBLIC) && vClassInfoObject.CRX_SHARED_SEGMENT.hasOwnProperty(pMember))));
				}
			}
		}

		return false;
	}
//STRUCTURES: END
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
	function signClassFunction(pFunction, pClassID, pIsStatic)
	{
		if(pFunction.hasOwnProperty('CRX_FUNCTION_ID'))
		{
			halt('UNKNOWN ERROR WHEN SIGNING CLASS FUNCTION IN CLASS \"' + getClassNameOrID(gClassDefinitions[pClassID]) + 
					'\". IS FUNCTION ALREADY BOUND?');
		}

		signFunction(pFunction, {'cf': {'classID': pClassID, 'isStatic': (pIsStatic ? true : false)}});
	}
	/*
	*	The reason for the two parameters pIsToAllowStaticFunctionsOnly and pIsToAllowFriendsOnlyWhenNonStatic is allow usage
	*			such as the resulting syntax when using CrxOop is the same when in strict js mode and when in not. The aim is to
	*			preserve the following:
	*		- Only O can be used to access the private members of an object, whether the caller is from the same class or friend class.
	*		- Only this.STATIC can be used to access the private statics of the current class from the same class. crx_static() should not
	*				allow such access, except when used in static functions of same class or friend classes.
	*		- crx_static() allows access to private statics in non static functions only if these functions are members of
	*				friend classes.
	*/
	function isCallerFromClassOrAFriend(pCaller, pClassID, pIsToAllowStaticFunctionsOnly, pIsToAllowFriendsOnlyWhenNonStatic)
	{
		//return (gStaticContext[1] === pCaller) && ((gStaticContext[0] === pClassID) || 
			//		gClassFriends[pClassID].hasOwnProperty(gStaticContext[0]));

		if(pCaller && pCaller.CRX_FUNCTION_ID)
		{
			var tData = getSignedFunctionData(pCaller);

			if((tData === null) || (!tData.cf))
				{return false;}
			else
				{tData = tData.cf;}

			if(pIsToAllowStaticFunctionsOnly)
			{
				return (tData.isStatic && 
						((tData.classID === pClassID) || gClassFriends[pClassID].hasOwnProperty(tData.classID)));
			}
			else if(pIsToAllowFriendsOnlyWhenNonStatic)
			{
				if(!tData.isStatic)
					{return (tData.classID !== pClassID) && gClassFriends[pClassID].hasOwnProperty(tData.classID);}
				else
					{return (tData.classID === pClassID) || gClassFriends[pClassID].hasOwnProperty(tData.classID);}
			}
			else
				{return (tData.classID === pClassID) || gClassFriends[pClassID].hasOwnProperty(tData.classID);}
		}

		return false;
	}
	function signFunction(pFunction, pData)
	{
		if(pFunction.hasOwnProperty('CRX_FUNCTION_ID'))
			{return false;}

		var vData = secureClassData(
		{
			'func': pFunction,
			'data': pData
		});

		if(gIsReadOnlyWriteSupported)
		{
			setObjectReadOnlyMember.o.value = vData;
			Object.defineProperty(pFunction, 'CRX_FUNCTION_ID', setObjectReadOnlyMember.o);
		}
		else
			{pFunction['CRX_FUNCTION_ID'] = vData;}
	}
	function getSignedFunctionData(pFunction)
	{
		if(!pFunction.CRX_FUNCTION_ID)
			{return null;}

		var vData = null;
			
		pFunction.CRX_FUNCTION_ID();
		vData = gSecureClassData_return;
		gSecureClassData_return = null;

		if((vData === null) || (vData.func !== pFunction))
		{
			if((vData === null) || pFunction.hasOwnProperty('CRX_FUNCTION_ID'))
				{halt('SECURITY ERROR, ACCESS VIOLATION');}
			return false;
		}

		return vData.data;
	}
	function assertIdentity(pServerInboundKey)
	{
		if(!gWindow)
			{return true;}

		var vMessage = "Security Error, exposed method overriden";

		if(window.crx_new !== _new){halt(vMessage);return false;}
		else if(window.crx_registerClass !== registerClass){halt(vMessage);return false;}
		else if(window.crx_registerInterface !== registerInterface){halt(vMessage);return false;}
		else if(window.crx_static !== _static){halt(vMessage);return false;}
		else if(crxOop.setLogger !== setLogger){halt(vMessage);return false;}
		else if(crxOop.assertFunctionIdentity !== assertFunctionIdentity){halt(vMessage);return false;}
		else if(crxOop.assertIdentity !== assertIdentity){halt(vMessage);return false;}
		else if(crxOop.instanceOf !== _instanceof){halt(vMessage);return false;}
		else if(crxOop.typeOf !== _typeOf){halt(vMessage);return false;}
		else {return true;}
	}
	function assertFunctionIdentity(pObject, pFTableIndex, pFunctionName)
	{
		if(gClassFTables[getObjectClassID(pObject.THIS)][pFTableIndex][pFunctionName] !==
				pObject[pFunctionName])
			{halt("Security Error, object's public method was overriden");return false;}
	}
	function halt(pErrorMessage, pError)
	{
		var tMessage = null;

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
				emptyObject(gClassStaticThis);

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
		
		tMessage = "CrxOop FATAL ERROR:: " + gHaltMessage;

		if(!gIsRunningTestCasesMode)
			{gFunc_log(tMessage, 0);}

		if(/*true ||*/ !gIsRunningTestCasesMode)
		{
			if(pError)
			{
				if(pError === -1)
				{
					try
						{throw new Error(tMessage);}
					catch(tE)
						{gTraceKitReport(tE, tMessage);}
				}
				else
				{
					if(gIS_BROWSER)
						{gTraceKitReport(pError, tMessage);}
					else
						{tMessage = gTraceKitReport(pError, tMessage);}
				}
			}
		}

		throw tMessage;
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
	setObjectReadOnlyMember.o = {value: null, writable: false, enumerable: false};
	function setObjectsReadOnlyMember(pObjects, pKey, pValue, pIsEnumerable)
	{
		if(gIS_STRICT_MODE && gIsReadOnlyWriteSupported)
		{
			setObjectReadOnlyMember.o.value = pValue;
			setObjectReadOnlyMember.o.enumerable = (pIsEnumerable ? true : false);
			for(var tI = pObjects.length - 1; tI > -1; tI--)
				{Object.defineProperty(pObjects[tI], pKey, setObjectReadOnlyMember.o);}
		}
		else
		{
			for(var tI = pObjects.length - 1; tI > -1; tI--)
				{pObjects[tI][pKey] = pValue;}
		}
	}
	function setObjectMember(pObject, pKey, pValue)
	{
		if(gIsDefinePropertySufficientlySupported)
		{
			setObjectMember.o.value = pValue;
			Object.defineProperty(pObject, pKey, setObjectMember.o);
		}
		else
			{pObject[pKey] = pValue;}
	}
	setObjectMember.o = {value: null, writable: true};
	function setObjectsMember(pObjects, pKey, pValue)
	{
		if(gIsDefinePropertySufficientlySupported)
		{
			setObjectMember.o.value = pValue;
			for(var tI = pObjects.length - 1; tI > -1; tI--)
				{Object.defineProperty(pObjects[tI], pKey, setObjectMember.o);}
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
		{
			var tSignatureData = getSignedFunctionData(pVariable);

			if((tSignatureData === null) || (tSignatureData.bf && tSignatureData.bf[0] !== null))
				{return crxOop_bind(pVariable, null, false, true, -1, null);}
			else
				{return pVariable;}
		}
		else
			{return pVariable;}
	}
	function crxOop_bind(pFunction, pThis, pIsToProtectFromDoubleBinding, pIsToSetPrototype, pLength, pBoundArguments)
	{
		if ((typeof pFunction !== 'function') || (Object.prototype.toString.call(pFunction) !== '[object Function]'))
			{return null;}

		var vBoundArguments = (pBoundArguments ? pBoundArguments : []);
		var vFunc_return = pFunction;
		var vFunc = null;
		var vSignedFunctionData = getSignedFunctionData(pFunction);
		var vSignatureData = null;
		var vIsToProceed = true;

		if(vSignedFunctionData && vSignedFunctionData.bf)
			{vSignatureData = vSignedFunctionData.bf}

		if(pIsToProtectFromDoubleBinding && (vSignatureData !== null))
		{
			if((pThis === vSignatureData[0]) && (pIsToSetPrototype === vSignatureData[1]) && ((pLength ? pLength : 0) === vSignatureData[2]) &&
					((pBoundArguments ? vBoundArguments : null) === vSignatureData[3]))
				{vIsToProceed = false;}
		}

		if(vIsToProceed)
		{
			if(pIsToSetPrototype)
			{
				vFunc = function()
				{
					if(this instanceof vFunc_return)
					{
						var result = pFunction.apply(this, vBoundArguments.concat(Array.prototype.slice.call(arguments)));
						
						if(Object(result) === result)
							{return result;}
						else
							{return this;}
					}
					else 
						{return pFunction.apply(((pThis === -1) ? this : pThis), vBoundArguments.concat(Array.prototype.slice.call(arguments)));}
				};
			}
			else
			{
				vFunc = function()
					{return pFunction.apply(((pThis === -1) ? this : pThis), vBoundArguments.concat(Array.prototype.slice.call(arguments)));}
			}

			if(pLength)
			{
				var tLength = (((pLength > 0) && (pLength < 11)) ? pLength : 
						Math.max(0, pFunction.length - vBoundArguments.length));

				switch(tLength)
				{
					case 0: vFunc_return = function(){return vFunc.apply(this, arguments);};
					case 1: vFunc_return = function(a){return vFunc.apply(this, arguments);};
					case 2: vFunc_return = function(a,b){return vFunc.apply(this, arguments);};
					case 3: vFunc_return = function(a,b,c){return vFunc.apply(this, arguments);};
					case 4: vFunc_return = function(a,b,c,d){return vFunc.apply(this, arguments);};
					case 5: vFunc_return = function(a,b,c,d,e){return vFunc.apply(this, arguments);};
					case 6: vFunc_return = function(a,b,c,d,e,f){return vFunc.apply(this, arguments);};
					case 7: vFunc_return = function(a,b,c,d,e,f,g){return vFunc.apply(this, arguments);};
					case 8: vFunc_return = function(a,b,c,d,e,f,g,h){return vFunc.apply(this, arguments);};
					case 9: vFunc_return = function(a,b,c,d,e,f,g,h,i){return vFunc.apply(this, arguments);};
					case 10: vFunc_return = function(a,b,c,d,e,f,g,h,i,j){return vFunc.apply(this, arguments);};
					default: vFunc_return = function(){return vFunc.apply(this, arguments);};
				}
			}
			else
				{vFunc_return = function(){return vFunc.apply(this, arguments);};}


			if(pIsToSetPrototype && pFunction.prototype)
			{
				var tFunc = function tFunc(){};

				tFunc.prototype = pFunction.prototype;
				vFunc_return.prototype = new tFunc();
				tFunc.prototype = null;
			}

			if(vSignedFunctionData)
				{vSignedFunctionData['bf'] = [pThis, pIsToSetPrototype, (pLength ? pLength : 0), (pBoundArguments ? vBoundArguments : null)];}
			else
				{signFunction(vFunc_return, {'bf': [pThis, pIsToSetPrototype, (pLength ? pLength : 0), (pBoundArguments ? vBoundArguments : null)]});}
		}

		return vFunc_return;
	}
	function crxOop_setTimeout()
	{
		var vFunction = arguments[0];

		arguments[0] = function()
		{
			if(gIsHalted){return;}
			vFunction();
		};

		return window.setTimeout.apply(window, arguments);
	}
	function crxOop_setInterval()
	{
		var vFunction = arguments[0];
		var vInterval = -1;

		arguments[0] = function()
		{
			if(gIsHalted){window.clearInterval(vInterval); return;}
			vFunction();
		};
		vInterval = window.setInterval.apply(window, arguments);

		return vInterval;
	}
	
	setObjectReadOnlyMember(gCrxOop, "HASOWN_TYPE_VAR", HASOWN_TYPE_VAR);
	setObjectReadOnlyMember(gCrxOop, "HASOWN_TYPE_FUNCTION", HASOWN_TYPE_FUNCTION);
	setObjectReadOnlyMember(gCrxOop, "HASOWN_TYPE_FOREIGN", HASOWN_TYPE_FOREIGN);
	setObjectReadOnlyMember(gCrxOop, "HASOWN_SCOPE_SHARED_PUBLIC", HASOWN_SCOPE_SHARED_PUBLIC);
	setObjectReadOnlyMember(gCrxOop, "HASOWN_SCOPE_SHARED_PRIVATE", HASOWN_SCOPE_SHARED_PRIVATE);
	setObjectReadOnlyMember(gCrxOop, "HASOWN_SCOPE_PRIVATE", HASOWN_SCOPE_PRIVATE);
	setObjectReadOnlyMember(gCrxOop, "crx_new", _new);
	setObjectReadOnlyMember(gCrxOop, "crx_registerClass", registerClass);
	setObjectReadOnlyMember(gCrxOop, "crx_registerInterface", registerInterface);
	setObjectReadOnlyMember(gCrxOop, "crx_registerStructure", registerStructure);
	setObjectReadOnlyMember(gCrxOop, "crx_static", 
			((gIS_STRICT_JS || gIS_USING_NEW_STATIC_SYNTAX) ? _static : _static__withStaticFunctionsSupport));
	setObjectReadOnlyMember(gCrxOop, "setLogger", setLogger);	
	setObjectReadOnlyMember(gCrxOop, "isAnnul", _isAnnul);
	//setObjectReadOnlyMember(window, "crxOop_assertFunctionIdentity", assertFunctionIdentity);
	//setObjectReadOnlyMember(window, "crxOop_assertIdentity", assertIdentity);
	setObjectReadOnlyMember(gCrxOop, "instanceOf", _instanceof);
	//setObjectReadOnlyMember(window, "crxOop_instanceof", _instanceof);
	setObjectReadOnlyMember(gCrxOop, "typeOf", _typeOf);
	//setObjectReadOnlyMember(window, "crxOop_typeof", _typeOf);
	setObjectReadOnlyMember(gCrxOop, "isClassExtending", 
			function(pClassDefinitionOrClassName1, pClassDefinitionOrClassName2)
			{return isClassExtending(pClassDefinitionOrClassName1, pClassDefinitionOrClassName2, false);});
	setObjectReadOnlyMember(gCrxOop, "isClassChaining", 
			function(pClassDefinitionOrClassName1, pClassDefinitionOrClassName2)
			{return isClassExtending(pClassDefinitionOrClassName1, pClassDefinitionOrClassName2, true);});
	setObjectReadOnlyMember(gCrxOop, "isClassImplementing", isClassImplementing);
	setObjectReadOnlyMember(gCrxOop, "isClassRegistered", isClassRegistered);
	setObjectReadOnlyMember(gCrxOop, "getObjectClassName", function (pObject)
	{
		if(!pObject.CRX_CLASS_INFO || !pObject.THIS)
			{return null;}

		var vClassID = getObjectClassID(pObject.THIS);

		if(vClassID && gClassDefinitions.hasOwnProperty(vClassID) && gClassDefinitions[vClassID].CRX_CLASS_NAME &&
				gClassSignatures.hasOwnProperty(gClassDefinitions[vClassID].CRX_CLASS_NAME))
			{return gClassDefinitions[vClassID].CRX_CLASS_NAME;}
		return null;
	});
	setObjectReadOnlyMember(gCrxOop, "isInterfaceRegistered", isInterfaceRegistered);
	setObjectReadOnlyMember(gCrxOop, "isStructureInheriting", 
			function(pStructureDefinitionOrStructureName1, pStructureDefinitionOrStructureName2)
			{return isStructureInheriting(pStructureDefinitionOrStructureName1, pStructureDefinitionOrStructureName2, false);});
	setObjectReadOnlyMember(gCrxOop, "isStructureContaining",
			function(pStructureDefinitionOrStructureName1, pStructureDefinitionOrStructureName2)
			{return isStructureInheriting(pStructureDefinitionOrStructureName1, pStructureDefinitionOrStructureName2, true);});
	setObjectReadOnlyMember(gCrxOop, "isStructureRegistered", isStructureRegistered);
	setObjectReadOnlyMember(gCrxOop, "getObjectStructureName", function (pObject)
	{
		if(!pObject.CRX_STRUCTURE_INFO)
			{return null;}

		var vStructureID = getObjectCurrentStructureID(pObject, getStructureInfoObject(pObject));

		if(vStructureID && gStructureDefinitions.hasOwnProperty(vStructureID) && gStructureDefinitions[vStructureID].CRX_STRUCTURE_NAME &&
				gStructureSignatures.hasOwnProperty(gStructureDefinitions[vStructureID].CRX_STRUCTURE_NAME))
			{return gStructureDefinitions[vStructureID].CRX_STRUCTURE_NAME;}
		return null;
	});
	setObjectReadOnlyMember(gCrxOop, "getObjectStructureNames", function (pObject)
	{
		if(!pObject.CRX_STRUCTURE_INFO)
			{return null;}

		var vReturn = null;
		var vStructureID = (pObject.CRX_STRUCTURE_ID || null);

		getStructureInfoObject(pObject);	//FOR SECURITY. CURRENT BEHAVIOR ON ALL EXTERNAL FUNCTIONS, INCLUDING typeOf DO NOT TOLERATE FAKE
											//	CRX_STRUCTURE_INFO OR FAKE CRX_CLASS_INFO
		if(vStructureID)
		{
			var tCompiledStructure = (gCompiledStructures[pObject.CRX_STRUCTURE_ID] || null);

			if(tCompiledStructure)
			{
				vReturn = {};

				for(var tI = 0; tI < tCompiledStructure.SHARED_LIST.length; tI++)
				{
					if(gStructureDefinitions[tCompiledStructure.SHARED_LIST[tI]].CRX_STRUCTURE_NAME &&
							gStructureSignatures.hasOwnProperty(gStructureDefinitions[tCompiledStructure.SHARED_LIST[tI]].CRX_STRUCTURE_NAME))
						{vReturn[gStructureDefinitions[tCompiledStructure.SHARED_LIST[tI]].CRX_STRUCTURE_NAME] = true;}
					else
					{
						vReturn = null; 
						break;
					}
				}
			}
		}

		return vReturn;
	});
	setObjectReadOnlyMember(gCrxOop, "areStaticFunctionsSupported", function(){return (!gIS_STRICT_JS || gIS_USING_NEW_STATIC_SYNTAX);});
	setObjectReadOnlyMember(gCrxOop, "isUsingNewStaticFunctionsSyntax", function(){return gIS_USING_NEW_STATIC_SYNTAX;});
	setObjectReadOnlyMember(gCrxOop, "createObject", gFunc_createObject);
	setObjectReadOnlyMember(gCrxOop, "setStrictMode", function(pIsStrictMode){if(gIsStarted){return;} gIS_STRICT_MODE = pIsStrictMode;});
	setObjectReadOnlyMember(gCrxOop, "areStructuresLocked", function(){return gIsReadOnlyWriteSupported && Object.seal && gFunc_freezeObject && gIS_STRICT_MODE;});
	setObjectReadOnlyMember(gCrxOop, "areConstantsLocked", function(){return gCrxOop.areStructuresLocked() || gAreConstantsToBeCopiedToObjects;});
	setObjectReadOnlyMember(gCrxOop, "var", crxOop_var);
	setObjectReadOnlyMember(gCrxOop, "bindFunction", crxOop_bind);
	setObjectReadOnlyMember(gCrxOop, "setTimeout", crxOop_setTimeout);
	setObjectReadOnlyMember(gCrxOop, "setInterval", crxOop_setInterval);
	setObjectReadOnlyMember(gCrxOop, "nativeTypeOf", getType);
	setObjectReadOnlyMember(gCrxOop, "setRunningTestCasesMode", function(pIsRunningTestCases){if(gIsStarted){return;}if(pIsRunningTestCases){gIsRunningTestCasesMode = true;}});
	setObjectReadOnlyMember(gCrxOop, "unHalt", function(pMessage){if(gIsRunningTestCasesMode){if(!gIsHalted){halt("UNHALTING WHEN NOT HALTED: " + pMessage);} gIsHalted = false;}});

	if(gWindow)
	{
		setObjectReadOnlyMember(gWindow, "crxOop", gCrxOop);
		setObjectReadOnlyMember(gWindow, "crx_new", _new);
		setObjectReadOnlyMember(gWindow, "crx_registerClass", registerClass);
		setObjectReadOnlyMember(gWindow, "crx_registerInterface", registerInterface);
		setObjectReadOnlyMember(gWindow, "crx_registerStructure", registerStructure);
		setObjectReadOnlyMember(gWindow, "crx_static", 
				((gIS_STRICT_JS || gIS_USING_NEW_STATIC_SYNTAX) ? _static : _static__withStaticFunctionsSupport));
	}

	/*gWindow.crxOop_halt = halt;*/

	try{throw new Error('CrxOop::end');}catch(tE){gTraceKitReport(tE);}
})();
